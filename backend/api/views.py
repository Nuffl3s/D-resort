from django.contrib.auth.models import User
from django.db.models import Q
from django.contrib.auth import authenticate
from rest_framework.generics import UpdateAPIView, DestroyAPIView
from django.contrib.auth.models import update_last_login
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .serializers import EmployeeSerializer, ProductSerializer, PayrollSerializer, CustomUserSerializer, UserSerializer, LogSerializer, WeeklyScheduleSerializer, CottageSerializer, LodgeSerializer, ReservationSerializer
from .models import Employee, Product, Payroll, CustomUser, Log, WeeklySchedule, Cottage, Lodge, Reservation
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from itertools import combinations
from django.conf import settings
from .permissions import IsAdminOrEmployee, IsAdminOnly
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import RetrieveAPIView
from django.contrib.contenttypes.models import ContentType
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer, CreateAccountSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework import status
from .models import Attendance
from .serializers import AttendanceSerializer, Account
from .serializers import CreateAccountSerializer
from datetime import date
from django.contrib.auth import get_user_model

class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Log registration
            Log.objects.create(
                username=user.username,
                action=f"User {user.username} registered as {user.user_type}.",
                category="Employee Registration"
            )
            return Response({"message": "User registered successfully!", "user_id": user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class CustomLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            update_last_login(None, user)

            Log.objects.create(
                username=user.username,
                action=f"{user.username} logged in.",
                category="System"
            )

            # Check user type and provide restricted access if employee
            if user.user_type == 'Employee':
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user_type": user.user_type,
                    "employee_page_url": f"/employee/{user.id}/"  # Redirect to employee page
                }, status=status.HTTP_200_OK)
            elif user.user_type == 'Admin':
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user_type": user.user_type,
                }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


# Backend: CreateAccountView
class CreateAccountView(APIView):
    def post(self, request, *args, **kwargs):
        user_data = request.data.get('user')
        employee_name = request.data.get('employee_name')  # Getting employee_name from the request

        # Check if both fields are provided
        if not user_data or not employee_name:
            return Response({'error': 'Missing user data or employee name'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if employee exists by name
        try:
            employee = Employee.objects.get(name=employee_name)  # Look for employee by name
        except Employee.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if username exists already
        if get_user_model().objects.filter(username=user_data['username']).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user and handle potential errors
        try:
            user = get_user_model().objects.create_user(username=user_data['username'], password=user_data['password'])
        except Exception as e:
            return Response({'error': f'Error creating user: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        # Now, we pass employee_name correctly
        data = {
            'user': user.id,  # Link to the user object
            'employee_name': employee_name  # Pass the employee name correctly
        }

        # Serialize and save the account
        serializer = CreateAccountSerializer(data=data)
        
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")  # Log errors to console for debugging
            return Response({'error': 'Error serializing account data', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer.save()  # Save the account and link the user to the employee
            return Response({'message': 'Account created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': f'Error saving account: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CheckUsernameView(APIView):
    def get(self, request, username, *args, **kwargs):
        # Check if the username already exists in the database
        if get_user_model().objects.filter(username=username).exists():
            return Response({'exists': True}, status=status.HTTP_200_OK)
        return Response({'exists': False}, status=status.HTTP_200_OK)
    
class CreateAdminView(APIView):

    def post(self, request, *args, **kwargs):
        # Get the super admin password from request data (for validation)
        super_admin_password = request.data.get('super_admin_password', '')

        # Validate super admin password (this is a hardcoded example; change this to a real check)
        if super_admin_password != 'Admin123':  # You can replace this with a more secure check
            return Response({'error': 'Invalid Super Admin Password'}, status=status.HTTP_400_BAD_REQUEST)

        # Proceed to create a new admin if super admin password is correct
        username = request.data.get('username')
        password = request.data.get('password')

        # Validate that username and password are provided
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the username already exists
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new admin user
        try:
            user = User.objects.create(
                username=username,
                password=make_password(password),  # Hash the password before saving
            )
            user.is_staff = True  # Set the user as an admin (staff)
            user.is_superuser = True  # Optional, make them a superuser
            user.save()

            return Response({'message': 'Admin created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(f"User: {request.user}, User Type: {getattr(request.user, 'user_type', None)}")
        user = request.user
        return Response({
            "username": user.username,
            "user_type": user.user_type,
        })
    
from rest_framework.response import Response

class RegisterEmployeeView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        employee = serializer.save()
        log_action = f"Employee {employee.name} registered with address {employee.address}."
        Log.objects.create(
            username="System",
            action=log_action,
            category="Employee Registration"
        )
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Return the updated list of employees
        employees = Employee.objects.all()
        employee_serializer = EmployeeSerializer(employees, many=True)
        return Response(employee_serializer.data, status=status.HTTP_201_CREATED)

    
class EmployeeListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class EditEmployeeView(UpdateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsAdminOnly]

class DeleteEmployeeView(DestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsAdminOnly]

    def destroy(self, request, *args, **kwargs):
        try:
            # This is the default destroy method behavior.
            employee = self.get_object()
            self.perform_destroy(employee)
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Employee.DoesNotExist:
            raise NotFound(detail="Employee not found")
        except IntegrityError:
            return Response({"detail": "This employee cannot be deleted due to existing dependencies."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WeeklyScheduleView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]

    def get(self, request):
        schedules = WeeklySchedule.objects.select_related('employee').all()
        serializer = WeeklyScheduleSerializer(schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        employee = Employee.objects.get(name=data['employee'])
        schedule = data.get('schedule', {})

        # Enforce day order
        day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        ordered_schedule = {day: schedule.get(day, {}) for day in day_order}

        # Save the ordered schedule
        weekly_schedule_data = {
            "employee": employee.name,
            "schedule": ordered_schedule,
        }

        existing_schedule = WeeklySchedule.objects.filter(employee=employee).first()
        if existing_schedule:
            serializer = WeeklyScheduleSerializer(existing_schedule, data=weekly_schedule_data)
        else:
            serializer = WeeklyScheduleSerializer(data=weekly_schedule_data)

        if serializer.is_valid():
            serializer.save(employee=employee)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UploadProductView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrEmployee]

    def post(self, request, *args, **kwargs):
        uploaded_products = request.data.get('products', [])
        if not uploaded_products:
            return Response({'error': 'No products provided'}, status=status.HTTP_400_BAD_REQUEST)

        log_entries = []  # To accumulate log entries
        for product_data in uploaded_products:
            product_name = product_data.get('name').lower()
            quantity = product_data.get('quantity')
            avg_price = product_data.get('avgPrice')

            if not (product_name and quantity and avg_price):
                return Response({'error': 'Product data is incomplete'}, status=status.HTTP_400_BAD_REQUEST)

            product_data['amount'] = quantity * avg_price

            try:
                # Update existing product
                existing_product = Product.objects.get(name__iexact=product_name)
                existing_product.quantity += quantity
                existing_product.save()
                log_entry = f"Updated product: {product_name}, Quantity added: {quantity}, New total: {existing_product.quantity}"
                log_entries.append(log_entry)
                # Log the update
                Log.objects.create(
                    username=request.user.username,
                    action=log_entry,
                    category="Inventory"
                )
            except Product.DoesNotExist:
                # Create a new product
                product_data['name'] = product_name
                serializer = ProductSerializer(data=product_data)
                if serializer.is_valid():
                    new_product = serializer.save()
                    log_entry = f"Created product: {new_product.name}, Quantity: {new_product.quantity}, Amount: {new_product.amount}"
                    log_entries.append(log_entry)
                    # Log the creation
                    Log.objects.create(
                        username=request.user.username,
                        action=log_entry,
                        category="Inventory"
                    )
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Products uploaded successfully', 'log_entries': log_entries}, status=status.HTTP_200_OK)


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminOrEmployee]
    
class DeleteProductView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated, IsAdminOrEmployee] 

class ProductAutocompleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrEmployee]

    def get(self, request):
        print(f"Authenticated user: {request.user}, User type: {getattr(request.user, 'user_type', None)}")
        query = request.GET.get('query', '')
        if query:
            products = Product.objects.filter(name__icontains=query)
            product_names = [{"name": product.name} for product in products]
            return Response(product_names)
        return Response([])

class PayrollListCreate(APIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]

    def get(self, request):
        # Ensure all employees have a payroll entry
        employees = Employee.objects.all()
        for employee in employees:
            # Remove duplicate payroll records for the same employee
            Payroll.objects.filter(employee=employee).exclude(status="Not yet").delete()
            # Ensure a single payroll entry per employee
            Payroll.objects.get_or_create(employee=employee, defaults={'status': 'Not yet'})

        payrolls = Payroll.objects.select_related('employee').all()
        serializer = PayrollSerializer(payrolls, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        data = request.data  # Expecting a list of payroll entries
        if not isinstance(data, list):
            return Response({"error": "Invalid data format. Expected a list of payroll entries."}, status=status.HTTP_400_BAD_REQUEST)

        for entry in data:
            try:
                employee = Employee.objects.get(name=entry['employee_name'])
                # Use update_or_create to avoid creating duplicates
                payroll, created = Payroll.objects.update_or_create(
                    employee=employee,
                    defaults={
                        'net_pay': entry['net_pay'],
                        'status': entry['status']
                    }
                )
                # Log the payroll creation or update
                action = "created" if created else "updated"
                Log.objects.create(
                    username=request.user.username,
                    action=f"Payroll {action} for {employee.name}, Net Pay: {payroll.net_pay}.",
                    category="Payroll"
                )
            except Employee.DoesNotExist:
                return Response({"error": f"Employee '{entry['employee_name']}' not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Payroll entries processed successfully!"}, status=status.HTTP_201_CREATED)


class PayrollDetail(APIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]

    def delete(self, request, pk):
        try:
            payroll = Payroll.objects.get(pk=pk)
            payroll.delete()
            Log.objects.create(
                username=request.user.username,
                action=f"Payroll deleted for {payroll.employee.name}.",
                category="Payroll"
            )
            return Response({"message": "Payroll entry deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        except Payroll.DoesNotExist:
            return Response({"error": "Payroll entry not found."}, status=status.HTTP_404_NOT_FOUND)
        
class UpdatePayrollView(UpdateAPIView):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data
        if 'status' in data:
            instance.status = data['status']
        if 'net_pay' in data:
            instance.net_pay = data['net_pay']
        instance.save()

        return Response({
            "id": instance.id,
            "status": instance.status,
            "net_pay": instance.net_pay
        }, status=200)

class LogView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]
    
    def get(self, request):
        category = request.query_params.get("category", None)  # Get category from query params
        if category and category != "All":
            logs = Log.objects.filter(category=category).order_by("-timestamp")
        else:
            logs = Log.objects.all().order_by("-timestamp")
        serializer = LogSerializer(logs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Save the log entry with the category
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CottageListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]
    # permission_classes = [AllowAny]
    # authentication_classes = []
    serializer_class = CottageSerializer

    def get_queryset(self):
        # Get the base queryset
        queryset = Cottage.objects.all()

        # Normalize custom_prices
        for cottage in queryset:
            if isinstance(cottage.custom_prices, list):
                normalized_prices = {
                    price['timeRange'].upper(): price['price']
                    for price in cottage.custom_prices
                    if 'timeRange' in price and 'price' in price
                }
                cottage.custom_prices = normalized_prices
                cottage.save()

        # Filter by capacity
        capacity = self.request.query_params.get('capacity')
        if capacity:
            try:
                capacity = int(capacity)
                queryset = queryset.filter(capacity__gte=capacity)
            except ValueError:
                
                pass  # Ignore invalid capacity values
        cottage_id = self.request.query_params.get('id')
        if cottage_id:
            queryset = queryset.filter(id=cottage_id)
        
        # Filter by name
        name = self.request.query_params.get('name')
        if name:
            queryset = queryset.filter(name__iexact=name.strip())
            print("Filtered Queryset by name:", queryset)
            
        return queryset


class LodgeListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]
    serializer_class = LodgeSerializer

    def get_queryset(self):
        # Get the base queryset
        queryset = Lodge.objects.all()

        # Normalize custom_prices
        for lodge in queryset:
            if isinstance(lodge.custom_prices, list):
                normalized_prices = {
                    price['timeRange']: price['price']
                    for price in lodge.custom_prices
                    if 'timeRange' in price and 'price' in price
                }
                lodge.custom_prices = normalized_prices
                lodge.save()

        # Filter by capacity
        capacity = self.request.query_params.get('capacity')
        if capacity:
            try:
                capacity = int(capacity)
                queryset = queryset.filter(capacity__gte=capacity)
            except ValueError:
                pass  # Ignore invalid capacity values

        # Filter by name
        name = self.request.query_params.get('name')
        if name:
            queryset = queryset.filter(name__iexact=name.strip())
            print("Filtered Queryset by name:", queryset)
            
        return queryset
    
class AddUnitView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]
    def post(self, request):
        try:
            # Parse custom_prices
            custom_prices = request.data.get("custom_prices", "[]")
            if isinstance(custom_prices, str):  # Parse JSON string
                custom_prices = json.loads(custom_prices)

            # Validate and format custom_prices
            if isinstance(custom_prices, list):
                custom_prices = {
                    entry["timeRange"]: entry["price"]
                    for entry in custom_prices
                    if "timeRange" in entry and "price" in entry
                }

            # Get and validate unit_type
            unit_type = request.data.get("unit_type", "").capitalize()
            if not unit_type:
                return Response({"error": "unit_type is required."}, status=400)

            if unit_type not in ["Cottage", "Lodge"]:
                return Response({"error": f"Invalid unit_type: {unit_type}"}, status=400)

            # Prepare data for saving
            data = {
                "name": request.data.get("name"),
                "capacity": request.data.get("capacity"),
                "custom_prices": custom_prices,
                "type": unit_type,
                "image": request.data.get("image"),  # Ensure image is included
            }
            serializer_class = CottageSerializer if unit_type == "Cottage" else LodgeSerializer
            serializer = serializer_class(data=data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class UpdateCottageView(RetrieveUpdateDestroyAPIView):
    queryset = Cottage.objects.all()
    serializer_class = CottageSerializer

    def update(self, request, *args, **kwargs):
        print("Request Data Received in Backend:", request.data)
        custom_prices = request.data.get("custom_prices")
        if isinstance(custom_prices, str):
            try:
                custom_prices = json.loads(custom_prices)
            except json.JSONDecodeError:
                return Response({"error": "Invalid custom_prices format."}, status=400)
        print("Parsed custom_prices:", custom_prices)

        # Ensure `type` is included
        if "type" not in request.data:
            return Response({"type": ["This field is required."]}, status=400)

        return super().update(request, *args, **kwargs)

class UpdateLodgeView(RetrieveUpdateDestroyAPIView):
    queryset = Lodge.objects.all()  # Ensure it uses the Lodge model
    serializer_class = LodgeSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        custom_prices = request.data.get("custom_prices")
        if isinstance(custom_prices, str):
            try:
                custom_prices = json.loads(custom_prices)
            except json.JSONDecodeError:
                return Response({"error": "Invalid custom_prices format."}, status=400)

        print("Parsed custom_prices:", custom_prices)

        # Ensure type is included
        if "type" not in request.data:
            return Response({"type": ["This field is required."]}, status=400)

        return super().update(request, *args, **kwargs)

class DeleteCottageView(DestroyAPIView):
    queryset = Cottage.objects.all()  # Ensure this matches the Cottage model
    serializer_class = CottageSerializer

class DeleteLodgeView(DestroyAPIView):
    queryset = Lodge.objects.all()  # Ensure this matches the Lodge model
    serializer_class = LodgeSerializer
    
class TotalUnitsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]
    def get(self, request):
        total_cottages = Cottage.objects.count()
        total_lodges = Lodge.objects.count()
        return Response({
            "total_cottages": total_cottages,
            "total_lodges": total_lodges
        })

class FilterUnitsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]
    
    def get(self, request):
        unit_type = request.query_params.get("type", "cottage").lower()  # Default to 'cottage'
        people = int(request.query_params.get("people", 1))
        num_combinations = int(request.query_params.get("num_combinations", 1))
        price_range = request.query_params.get("price_range", "all").lower()

        # Determine the queryset based on path
        if request.path == '/api/cottages/':
            queryset = Cottage.objects.all()
        else:
            queryset = Lodge.objects.all()

        # Normalize custom_prices and filter by capacity
        for unit in queryset:
            if isinstance(unit.custom_prices, list):
                normalized_prices = {
                    price['timeRange']: price['price']
                    for price in unit.custom_prices
                    if 'timeRange' in price and 'price' in price
                }
                unit.custom_prices = normalized_prices
                unit.save()

        # Filter by capacity
        capacity = request.query_params.get('capacity')
        if capacity:
            try:
                capacity = int(capacity)
                queryset = queryset.filter(capacity__gte=capacity)
            except ValueError:
                pass  # Ignore invalid capacity values

        # Serialize and return the response
        serializer_class = CottageSerializer if request.path == '/api/cottages/' else LodgeSerializer
        serializer = serializer_class(queryset, many=True, context={"request": request})
        return Response(serializer.data)

class CottageDetailView(RetrieveAPIView):
    queryset = Cottage.objects.all()
    serializer_class = CottageSerializer

class LodgeDetailView(RetrieveAPIView):
    queryset = Lodge.objects.all()
    serializer_class = LodgeSerializer

def get_reservations_with_unit_details():
    reservations = Reservation.objects.all()
    serialized_reservations = []

    for reservation in reservations:
        unit_details = None
        if reservation.content_type and reservation.object_id:
            # Fetch the related unit (Cottage or Lodge)
            try:
                unit_model = reservation.content_type.get_object_for_this_type(id=reservation.object_id)
                unit_details = {
                    "image": unit_model.image.url if hasattr(unit_model, "image") and unit_model.image else "/static/default-image.jpg",
                    "capacity": getattr(unit_model, "capacity", "N/A"),
                    "custom_prices": getattr(unit_model, "custom_prices", {}),
                }
            except Exception as e:
                print(f"Error fetching unit details: {e}")

        serialized_reservations.append({
            "id": reservation.id,
            "customer_name": reservation.customer_name,
            "customer_email": reservation.customer_email,
            "customer_mobile": reservation.customer_mobile,
            "date_of_reservation": reservation.date_of_reservation,
            "time_of_use": reservation.time_of_use,
            "total_price": reservation.total_price,
            "transaction_date": reservation.transaction_date,
            "unit_name": getattr(unit_model, "name", "N/A") if unit_model else "N/A",
            "unit_type": reservation.content_type.name if reservation.content_type else "N/A",
            "unit_details": unit_details
        })

    return serialized_reservations 

class ReservationView(APIView):
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    
    def get(self, request):
        reservations = Reservation.objects.select_related("content_type")
        serializer = ReservationSerializer(reservations, many=True, context={"request": request})
        return Response(serializer.data, status=200)

    def post(self, request):
        data = request.data.copy()
        unit_type = data.get("content_type")
        unit_name = data.get("unit_name")

        if unit_type and unit_name:
            try:
                if unit_type.lower() == "cottage":
                    unit = Cottage.objects.get(name=unit_name)
                    data["content_type"] = ContentType.objects.get_for_model(Cottage).id
                    data["object_id"] = unit.id
                elif unit_type.lower() == "lodge":
                    unit = Lodge.objects.get(name=unit_name)
                    data["content_type"] = ContentType.objects.get_for_model(Lodge).id
                    data["object_id"] = unit.id
            except Cottage.DoesNotExist:
                return Response({"error": f"Cottage '{unit_name}' not found."}, status=400)
            except Lodge.DoesNotExist:
                return Response({"error": f"Lodge '{unit_name}' not found."}, status=400)

        serializer = ReservationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class ReservationDetailView(generics.RetrieveAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

class EmployeeCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class AttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'user' not in request.data:
            return Response({"detail": "'user' field is required."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Attendance recorded successfully!"}, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        user_id = request.query_params.get('user', None)
        if user_id:
            attendances = Attendance.objects.filter(user_id=user_id)
        else:
            attendances = Attendance.objects.all()

        serializer = AttendanceSerializer(attendances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk=None):
        user_id = request.data.get('user')
        if not user_id:
            return Response({"detail": "'user' field is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Get today's date
        today = date.today()

        # Try to get today's attendance record for the user
        attendances = Attendance.objects.filter(user_id=user_id, date=today)

        if attendances.exists():
            # Check if the user already has both time_in and time_out set for today
            attendance = attendances.order_by('-time_in').first()
            
            if attendance.time_in and attendance.time_out:
                # Both time_in and time_out are already filled
                return Response({"detail": "Attendance already clocked out for today. Please try tomorrow."}, status=status.HTTP_400_BAD_REQUEST)

            # If only time_in exists, update the time_out field
            time_out = request.data.get('time_out', None)
            if time_out:
                # Ensure time_out is valid and not in the past
                attendance.time_out = time_out
                attendance.save()
                return Response({'message': 'Time out updated successfully!'}, status=status.HTTP_200_OK)

            return Response({'detail': 'Invalid time_out format.'}, status=status.HTTP_400_BAD_REQUEST)

        else:
            # If no attendance record found for today, create a new one
            return Response({'detail': 'Attendance record not found for today or already clocked out.'}, status=status.HTTP_404_NOT_FOUND)



        
