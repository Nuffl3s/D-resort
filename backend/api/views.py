from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, EmployeeSerializer, ScheduleSerializer, ProductSerializer, PayrollSerializer
from .models import Employee, Schedule, Product, Payroll
from rest_framework.permissions import AllowAny

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class RegisterEmployeeView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [AllowAny]  # Ensure this is set
    
class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    
class EmployeeScheduleView(generics.RetrieveUpdateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    lookup_field = 'employee'  # Lookup the schedule by employee ID

    def get_object(self):
        employee_id = self.kwargs['employee_id']
        return Schedule.objects.get_or_create(employee_id=employee_id)[0]  # Create a schedule if none exists
    
class UploadProductView(APIView):
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
    
class DeleteProductView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'

class ProductAutocompleteView(APIView):
    def get(self, request):
        query = request.GET.get('query', '')
        if query:
            products = Product.objects.filter(name__icontains=query)  # Case-insensitive search
            product_names = [{"name": product.name} for product in products]
            return Response(product_names)
        return Response([])

class PayrollListCreate(APIView):
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