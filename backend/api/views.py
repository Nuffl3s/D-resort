from django.contrib.auth.models import User
from django.db.models import Q
from django.contrib.auth import authenticate
from rest_framework.generics import UpdateAPIView, DestroyAPIView
from django.contrib.auth.models import update_last_login
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .serializers import EmployeeSerializer, ProductSerializer, PayrollSerializer, CustomUserSerializer, UserSerializer, LogSerializer, WeeklyScheduleSerializer, CottageSerializer, LodgeSerializer
from .models import Employee, Product, Payroll, CustomUser, Log, WeeklySchedule, Cottage, Lodge
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from itertools import combinations
from django.conf import settings
from .permissions import IsAdminOrEmployee, IsAdminOnly
from rest_framework.generics import RetrieveUpdateDestroyAPIView
import json


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

            # Log the login action
            Log.objects.create(
                username=user.username,
                action=f"{user.username} logged in.",
                category="System"
            )

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_type": user.user_type,
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

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
                payroll = Payroll.objects.create(
                    employee=employee,
                    net_pay=entry['net_pay'],
                    status=entry['status']
                )
                # Log the payroll creation
                Log.objects.create(
                    username=request.user.username,
                    action=f"Payroll created for {employee.name}, Net Pay: {payroll.net_pay}.",
                    category="Payroll"
                )
            except Employee.DoesNotExist:
                return Response({"error": f"Employee '{entry['employee_name']}' not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Payroll entries created successfully!"}, status=status.HTTP_201_CREATED)


    
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

    def patch(self, request, pk):
        try:
            payroll = Payroll.objects.get(pk=pk)
            data = request.data

            # Update the status field
            payroll.status = data.get('status', payroll.status)
            payroll.save()
            
            return Response({"message": "Payroll status updated successfully!"}, status=status.HTTP_200_OK)
        except Payroll.DoesNotExist:
            return Response({"error": "Payroll entry not found."}, status=status.HTTP_404_NOT_FOUND)

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
    queryset = Cottage.objects.all()
    serializer_class = CottageSerializer

    def get_queryset(self):
        # Get the queryset properly
        cottages = super().get_queryset()
        
        # Normalize custom_prices for each cottage
        for cottage in cottages:
            if isinstance(cottage.custom_prices, list):
                # Convert list to dictionary using timeRange as keys
                normalized_prices = {
                    price['timeRange'].upper(): price['price'] 
                    for price in cottage.custom_prices 
                    if 'timeRange' in price and 'price' in price
                }
                cottage.custom_prices = normalized_prices
                cottage.save()
        return cottages


class LodgeListView(generics.ListCreateAPIView):
    queryset = Lodge.objects.all()
    serializer_class = LodgeSerializer
    
    def get_queryset(self):
        lodges = super().get_queryset()
        for lodge in lodges:
            if isinstance(lodge.custom_prices, list):
                normalized_prices = {
                    price['timeRange']: price['price']
                    for price in lodge.custom_prices
                    if 'timeRange' in price and 'price' in price
                }
                lodge.custom_prices = normalized_prices
                lodge.save()
        return lodges

class TotalUnitsView(APIView):
    def get(self, request):
        total_cottages = Cottage.objects.count()
        total_lodges = Lodge.objects.count()
        return Response({
            "total_cottages": total_cottages,
            "total_lodges": total_lodges
        })

class AddUnitView(APIView):
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

class FilterUnitsView(APIView):
    def get(self, request):
        people = int(request.query_params.get("people", 1))
        num_combinations = int(request.query_params.get("num_combinations", 1))
        unit_type = request.query_params.get("type", "all").lower()
        price_range = request.query_params.get("price_range", "all").lower()

        # Filter by type
        if unit_type == "cottage":
            units = Cottage.objects.all()
            serializer_class = CottageSerializer
        elif unit_type == "lodge":
            units = Lodge.objects.all()
            serializer_class = LodgeSerializer
        else:
            cottages = list(Cottage.objects.all())
            lodges = list(Lodge.objects.all())
            units = cottages + lodges
            serializer_class = None  # Handle mixed serialization

        # Filter by price range
        if price_range == "under_100":
            units = [u for u in units if getattr(u, "time_24hrs_price", 0) < 100]
        elif price_range == "100_200":
            units = [u for u in units if 100 <= getattr(u, "time_24hrs_price", 0) <= 200]
        elif price_range == "200_and_above":
            units = [u for u in units if getattr(u, "time_24hrs_price", 0) > 200]

        # Process combinations
        units = sorted(units, key=lambda x: x.capacity, reverse=True)
        valid_combinations = []
        for combo in combinations(units, num_combinations):
            combo_capacity = sum(c.capacity for c in combo)
            if combo_capacity >= people:
                valid_combinations.append((combo_capacity, list(combo)))

        if valid_combinations:
            best_combination = min(valid_combinations, key=lambda x: x[0])
            recommended_units = best_combination[1]
        else:
            return Response({"error": "No results found for the given filters."}, status=400)

        # **Add the image_url here**:
        for unit in recommended_units:
            if hasattr(unit, "image") and unit.image:
                unit.image_url = request.build_absolute_uri(unit.image.url)
                print(f"Unit: {unit.name}, Image URL: {unit.image_url}")
            else:
                print(f"Unit: {unit.name} has no image")

        # Serialize recommendations
        if serializer_class:
            recommended_serializer = serializer_class(recommended_units, many=True, context={"request": request})
        else:
            # Mixed serialization for "all"
            recommended_serializer = [
                CottageSerializer(unit, context={"request": request}).data if isinstance(unit, Cottage)
                else LodgeSerializer(unit, context={"request": request}).data
                for unit in recommended_units
            ]

        return Response({"recommended": recommended_serializer})




