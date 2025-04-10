from django.contrib.auth.models import User
from django.db.models import Q
from django.contrib.auth import authenticate
from rest_framework.generics import UpdateAPIView, DestroyAPIView
from django.contrib.auth.models import update_last_login
from rest_framework.generics import RetrieveUpdateAPIView
from django.contrib.auth.hashers import check_password, make_password
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.http import JsonResponse
from .serializers import EmployeeSerializer, ProductSerializer, PayrollSerializer, CustomUserSerializer, UserSerializer, LogSerializer, WeeklyScheduleSerializer, CottageSerializer, LodgeSerializer, ReservationSerializer, CustomerAccountSerializer, PayrollListSerializer
from .models import Employee, Product, Payroll, CustomUser, Log, WeeklySchedule, Cottage, Lodge, Reservation, CustomerAccount
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from itertools import combinations
from django.conf import settings
from .permissions import IsAdminOrEmployee, IsAdminOnly, AllUser
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
from datetime import date, timezone
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from datetime import timedelta
import logging
from .models import PayrollList
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Employee, Payroll, PayrollList
from .serializers import PayrollSerializer, PayrollListSerializer
from datetime import timedelta

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

            # Ensure 'user_type' is included in the response
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username,
                "user_type": user.user_type  # Make sure this is correct
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

class AdminAccountsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]

    def get(self, request):
        admins = CustomUser.objects.filter(user_type="Admin")  # Fetch all Admin accounts
        serializer = UserSerializer(admins, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AdminCredentialView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.user_type == 'Admin':
            return Response({
                "username": request.user.username,
                "password": "hidden_for_security",  # Replace with securely fetched password
            })
        return Response({"error": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

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
        # Retrieve the currently authenticated user
        user = request.user
        serializer = UserSerializer(user)  # Serialize only the logged-in user's data
        return Response(serializer.data, status=status.HTTP_200_OK)


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

    # GET: List all schedules
    def get(self, request):
        schedules = WeeklySchedule.objects.select_related('employee').all()
        serializer = WeeklyScheduleSerializer(schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST: Create or update schedule
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

    # DELETE: Delete a specific schedule
    def delete(self, request, pk=None):
        if pk:
            try:
                schedule = WeeklySchedule.objects.get(id=pk)
                schedule.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except WeeklySchedule.DoesNotExist:
                return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'Schedule ID required for deletion.'}, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Clear all schedules
    def delete(self, request, *args, **kwargs):
        try:
            WeeklySchedule.objects.all().delete()
            return Response({'detail': 'All schedules deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error clearing all schedules: {str(e)}")
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
                # Ensure acquisitionCost is provided or set it to 0
                product_data['acquisitionCost'] = product_data.get('acquisitionCost', 0)  # Default to 0 if missing
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
        # Fetch all payroll entries
        payrolls = Payroll.objects.all()
        serializer = PayrollSerializer(payrolls, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data  # Expecting a list of payroll entries
        if not isinstance(data, list):
            return Response({"error": "Invalid data format. Expected a list of payroll entries."}, status=status.HTTP_400_BAD_REQUEST)

        for entry in data:
            try:
                employee = Employee.objects.get(name=entry['employee_name'])
                Payroll.objects.update_or_create(
                    employee=employee,
                    defaults={
                        'net_pay': entry['net_pay'],
                        'status': entry['status'],
                        'rate': entry['rate'],  # Ensure this is included
                    }
                )
            except Employee.DoesNotExist:
                return Response({"error": f"Employee '{entry['employee_name']}' not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Payroll entries processed successfully!"}, status=status.HTTP_201_CREATED)

# This view fetches the payroll list
class PayrollListView(APIView):
    def get(self, request):
        payroll_list = PayrollList.objects.select_related('employee').all()
        serializer = PayrollListSerializer(payroll_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        employee_name = request.data.get('employee_name')
        try:
            employee = Employee.objects.get(name=employee_name)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

        payroll_list = PayrollList.objects.create(
            employee=employee,
            status='Not yet',
            net_pay=0,
        )
        serializer = PayrollListSerializer(payroll_list)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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

logger = logging.getLogger(__name__)    
# views.py


class UpdatePayrollView(APIView):
    def put(self, request, name):
        try:
            # Check if the employee exists
            employee = Employee.objects.get(name=name)
        except Employee.DoesNotExist:
            logger.error(f"Employee '{name}' not found.")
            return Response({"error": f"Employee '{name}' not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if payroll exists, otherwise create a new one
        try:
            payroll = Payroll.objects.get(employee=employee)
        except Payroll.DoesNotExist:
            logger.info(f"Payroll not found for employee '{name}', creating a new payroll entry.")
            payroll = Payroll.objects.create(
                employee=employee,
                rate=request.data.get('rate', 0),
                total_hours=request.data.get('total_hours', 0),
                deductions=request.data.get('deductions', 0),
                status=request.data.get('status', 'Not yet')
            )

        # Update payroll fields with data from the request
        if 'rate' in request.data:
            payroll.rate = request.data['rate']
        if 'total_hours' in request.data:
            payroll.total_hours = request.data['total_hours']
        if 'deductions' in request.data:
            payroll.deductions = request.data['deductions']

        # Automatically set the status to 'Calculated' if rate and total_hours are provided
        if payroll.rate and payroll.total_hours:
            payroll.status = 'Calculated'

        # Recalculate net pay and save the payroll
        payroll.calculate_net_pay()
        payroll.save()

        # Create or update payroll entry in PayrollList
        payroll_list_data = {
            "employee": employee,
            "net_pay": payroll.net_pay,
            "status": payroll.status
        }

        # Check if the payroll entry already exists, otherwise update it
        payroll_list, created = PayrollList.objects.update_or_create(
            employee=employee,
            defaults=payroll_list_data
        )

        # Log successful payroll update
        logger.info(f"Payroll for employee '{name}' updated successfully.")

        # Return the updated payroll details
        serializer = PayrollSerializer(payroll)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
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
    permission_classes = [IsAuthenticated, AllUser]
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
    permission_classes = [IsAuthenticated, AllUser]
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
    permission_classes = [IsAuthenticated, IsAdminOrEmployee]
    def get(self, request):
        total_cottages = Cottage.objects.count()
        total_lodges = Lodge.objects.count()
        return Response({
            "total_cottages": total_cottages,
            "total_lodges": total_lodges
        })

class FilterUnitsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrEmployee]
    
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

def reservations_view(request):
    reservations = Reservation.objects.all()
    response = [
        {
            "unit_name": res.unit_name,
            "date_of_reservation": res.date_of_reservation.strftime("%Y-%m-%d"),
            "time_of_use": res.time_of_use,  # Include reserved times
        }
        for res in reservations
    ]
    return JsonResponse(response, safe=False)

from datetime import datetime
from django.db.models import Count


class ReservationView(APIView):
    permission_classes = [IsAuthenticated, AllUser]

    def get(self, request):
        reservations = Reservation.objects.filter(customer=request.user.customer_account)
        serializer = ReservationSerializer(reservations, many=True, context={"request": request})
        return Response(serializer.data, status=200)

    def get(self, request): #important
        reservations = Reservation.objects.all()
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        # Allow list input
        if isinstance(request.data, list):
            serializer = ReservationSerializer(data=request.data, many=True)
        else:
            serializer = ReservationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def post(self, request):
        # Allow staff to specify customer in request data
        if request.user.is_staff:
            serializer = ReservationSerializer(data=request.data, context={'request': request})
        else:
            # For regular users, force customer to be themselves
            data = request.data.copy()
            data['customer'] = request.user.customer_account.id
            serializer = ReservationSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

        serializer = ReservationSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            reservation = serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            reservation = Reservation.objects.get(pk=pk)
            reservation.delete()
            Log.objects.create(
                username=request.user.username,
                action=f"Deleted reservation for {reservation.customer.name}",
                category="Reservation"
            )
            return Response({"message": "Reservation deleted successfully!"}, status=204)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservation not found."}, status=404)

    def put(self, request, pk):
        try:
            reservation = Reservation.objects.get(pk=pk)
            serializer = ReservationSerializer(reservation, data=request.data, partial=True)
            if serializer.is_valid():
                updated_reservation = serializer.save()
                Log.objects.create(
                    username=request.user.username,
                    action=f"Updated reservation for {updated_reservation.customer.name}",
                    category="Reservation"
                )
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservation not found."}, status=404)
        
    def put(self, request, pk):
        try:
            reservation = Reservation.objects.get(pk=pk)
            serializer = ReservationSerializer(reservation, data=request.data, partial=True)
            if serializer.is_valid():
                updated_reservation = serializer.save()
                Log.objects.create(
                    username=request.user.username if request.user.is_authenticated else "Guest",
                    action=f"Updated reservation for {updated_reservation.customer_name}",
                    category="Reservation"
                )
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservation not found."}, status=404)

class UserReservationLogsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filter reservations by the logged-in user's account
        reservations = Reservation.objects.filter(customer=request.user.customer_account)

        # Optional query parameters for filtering
        unit_name = request.query_params.get('unit_name')
        unit_type = request.query_params.get('unit_type')
        sort_option = request.query_params.get('sort', 'recent')

        if unit_name:
            reservations = reservations.filter(unit_name=unit_name)
        if unit_type:
            reservations = reservations.filter(unit_type__iexact=unit_type)

        # Apply sorting
        if sort_option == 'recent':
            reservations = reservations.order_by('-date_of_reservation')
        elif sort_option == 'most_reserved':
            reservations = reservations.annotate(reservation_count=Count('id')).order_by('-reservation_count')

        # Serialize and return the reservations
        serializer = ReservationSerializer(reservations, many=True, context={'request': request})
        return Response(serializer.data, status=200)

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

    def calculate_weekly_hours(self, user_id):
        # Get the date range for the past 7 days
        today = timezone.now().date()
        start_date = today - timedelta(days=7)

        # Fetch attendance records for the user within the date range
        attendances = Attendance.objects.filter(
            user_id=user_id,
            time_in__date__gte=start_date,
            time_in__date__lte=today
        )

        total_hours = 0
        for attendance in attendances:
            if attendance.time_in and attendance.time_out:
                time_in = attendance.time_in
                time_out = attendance.time_out
                duration = (time_out - time_in).total_seconds() / 3600  # Convert seconds to hours
                total_hours += duration

        return total_hours

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
        if 'user' not in request.data:
            return Response({"detail": "'user' field is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Get today's date
        # today = date.today()

        # Try to get today's attendance record for the user
        attendances = Attendance.objects.filter(user_id=user_id) 
        # date=today
 
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



class CustomerAccountRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CustomerAccountSerializer(data=request.data)
        if serializer.is_valid():
            # Step 1: Create a CustomUser
            user = CustomUser.objects.create_user(
                username=request.data['username'],
                password=request.data['password'],
                user_type="Customer"  # Set user_type explicitly
            )

            # Step 2: Create the CustomerAccount and link to the CustomUser
            customer = CustomerAccount.objects.create(
                user=user,
                username=request.data['username'],
                email=request.data['email'],
                name=request.data['name'],
                phone_number=request.data['phone_number']
            )

            # Step 3: Generate tokens for the customer
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Customer registered successfully!",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user_type": customer.user_type
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate using Django's built-in function
        customer = authenticate(username=username, password=password)

        if customer is not None and hasattr(customer, 'customer_account'):
            refresh = RefreshToken.for_user(customer)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": customer.username,
                "user_type": customer.customer_account.user_type,
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class CustomerDetailsView(APIView):
    serializer_class = CustomerAccountSerializer
    permission_classes = [IsAuthenticated, AllUser]

    def get_object(self):
        # Fetch the CustomerAccount linked to the authenticated user
        try:
            return self.request.user.customer_account
        except CustomerAccount.DoesNotExist:
            return None

    def get(self, request, *args, **kwargs):
        customer = self.get_object()
        if not customer:
            return Response({"error": "Customer account not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(customer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated, AllUser]

    def post(self, request):
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        customer = request.user

        # Check if current password is correct
        if not check_password(current_password, customer.password):
            return Response({"error": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate new password length
        if len(new_password) < 8:
            return Response({"error": "New password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the password
        customer.password = make_password(new_password)
        customer.save()

        return Response({"message": "Password updated successfully!"}, status=status.HTTP_200_OK)

class CalendarView(APIView):
    permission_classes = [IsAuthenticated, AllUser]

    def get(self, request):
        unit_name = request.query_params.get("unit_name")
        if not unit_name:
            return Response({"error": "unit_name is required."}, status=400)
        try:
            reservations = Reservation.objects.filter(unit_name=unit_name)
            data = [
                {
                    "date": res.date_of_reservation,
                    "times": res.time_of_use.split(",") if res.time_of_use else [],
                }
                for res in reservations
            ]
            return Response(data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
class CustomerAccountListView(generics.ListAPIView):
    queryset = CustomerAccount.objects.all()
    serializer_class = CustomerAccountSerializer
    permission_classes = [IsAuthenticated, IsAdminOrEmployee]