from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import EmployeeSerializer, ProductSerializer, PayrollSerializer, CustomUserSerializer, UserSerializer
from .models import Employee, Product, Payroll, CustomUser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import IsAdminOrEmployee, IsAdminOnly


class RegisterUserView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Save and create user
            return Response({"message": "User registered successfully!", "user_id": user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CustomLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        print(f"Attempting to authenticate user: {username}")  # Debugging line
        user = authenticate(username=username, password=password)

        if user is not None:
            # Successful login
            refresh = RefreshToken.for_user(user)
            update_last_login(None, user)  # Update last login timestamp
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_type": user.user_type,
            }, status=status.HTTP_200_OK)
        else:
            # Login failed
            print("Authentication failed. Invalid credentials.")  # Debugging line
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
    
class RegisterEmployeeView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [AllowAny]  # Ensure this is set
    
class EmployeeListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    
    
class UploadProductView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrEmployee]
    
    def post(self, request, *args, **kwargs):
        uploaded_products = request.data.get('products', [])
        if not uploaded_products:
            return Response({'error': 'No products provided'}, status=status.HTTP_400_BAD_REQUEST)

        for product_data in uploaded_products:
            # Get the product name, quantity, and avg_price from the request
            product_name = product_data.get('name').lower()  # Convert to lowercase for case-insensitive comparison
            quantity = product_data.get('quantity')
            avg_price = product_data.get('avgPrice')

            if not (product_name and quantity and avg_price):
                return Response({'error': 'Product data is incomplete'}, status=status.HTTP_400_BAD_REQUEST)

            # Calculate the amount if not provided
            product_data['amount'] = quantity * avg_price

            # Try to find an existing product by name (case-insensitive)
            try:
                existing_product = Product.objects.get(name__iexact=product_name)

                # If found, update the quantity and recalculate the avg_price if needed
                existing_product.quantity += quantity
                existing_product.save()

            except Product.DoesNotExist:
                # If product does not exist, create a new one
                product_data['name'] = product_name  # Ensure the name is lowercase for consistency
                serializer = ProductSerializer(data=product_data)

                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Products uploaded successfully'}, status=status.HTTP_200_OK)

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
        # Retrieve all payroll entries
        payrolls = Payroll.objects.select_related('employee').all()
        serializer = PayrollSerializer(payrolls, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Handle the creation of payroll entries
        data = request.data  # Expecting a list of payroll entries
        if not isinstance(data, list):
            return Response({"error": "Invalid data format. Expected a list of payroll entries."}, status=status.HTTP_400_BAD_REQUEST)
        
        for entry in data:
            try:
                employee = Employee.objects.get(name=entry['employee_name'])
                Payroll.objects.create(
                    employee=employee,
                    net_pay=entry['net_pay'],
                    status=entry['status']
                )
            except Employee.DoesNotExist:
                return Response({"error": f"Employee '{entry['employee_name']}' not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Payroll entries created successfully!"}, status=status.HTTP_201_CREATED)
    
class PayrollDetail(APIView):
    permission_classes = [IsAuthenticated, IsAdminOnly]
    
    def delete(self, request, pk):
        """
        Handle DELETE request to delete a payroll entry by ID.
        """
        try:
            payroll = Payroll.objects.get(pk=pk)
            payroll.delete()
            return Response({"message": "Payroll entry deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        except Payroll.DoesNotExist:
            return Response({"error": "Payroll entry not found."}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        """
        Handle PATCH request to update specific fields of a payroll entry by ID.
        """
        try:
            payroll = Payroll.objects.get(pk=pk)
            data = request.data

            # Update fields if provided
            payroll.net_pay = data.get('net_pay', payroll.net_pay)
            payroll.status = data.get('status', payroll.status)

            payroll.save()
            return Response({"message": "Payroll entry updated successfully!"}, status=status.HTTP_200_OK)
        except Payroll.DoesNotExist:
            return Response({"error": "Payroll entry not found."}, status=status.HTTP_404_NOT_FOUND)