from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from api.views import RegisterUserView, CustomLoginView, RegisterEmployeeView, EmployeeListCreateView, UploadProductView, ProductListView, ProductAutocompleteView, PayrollListCreate, PayrollDetail, UserDetailsView, LogView, WeeklyScheduleView
from api.views import EditEmployeeView, DeleteEmployeeView, CottageListView, LodgeListView, AddUnitView, DeleteCottageView, DeleteLodgeView, TotalUnitsView, FilterUnitsView, UpdateCottageView, UpdateLodgeView
from api.views import UpdatePayrollView, TotalUnitsView, ReservationView, AdminAccountsView, CustomerAccountRegisterView, CustomerLoginView, CustomerDetailsView, ChangePasswordView
from api.views import CalendarView, UserReservationLogsView, CustomerAccountListView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import EmployeeCreateView
from api.views import AttendanceView
from api.views import CreateAccountView
from api.views import CheckUsernameView
from api.views import CreateAdminView
from api.views import PayrollListView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/reguser/", RegisterUserView.as_view(), name="register"),
    path("api/logtoken/", CustomLoginView.as_view(), name="login"),
    path('api/user-details/', UserDetailsView.as_view(), name='user-details'),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path('api/register/', RegisterEmployeeView.as_view(), name='register_employee'),
    path('api/employees/', EmployeeListCreateView.as_view(), name="employee_list_create"),
    path('api/employees/<int:pk>/edit/', EditEmployeeView.as_view(), name='edit-employee'),
    path('api/employees/<int:pk>/', DeleteEmployeeView.as_view(), name='delete-employee'),
    path('api/weekly-schedules/', WeeklyScheduleView.as_view(), name='weekly-schedule-list'),  # For GET and POST
    path('api/weekly-schedules/clear/', WeeklyScheduleView.as_view(), name='clear-schedules'),  # For clearing all schedules
    path('api/weekly-schedules/<int:pk>/', WeeklyScheduleView.as_view(), name='delete-schedule'),
    path('api/uploadproducts/', UploadProductView.as_view(), name="productupload"),
    path('api/products/', ProductListView.as_view(), name="productlist"),
    path('api/product-autocomplete/', ProductAutocompleteView.as_view(), name='product-autocomplete'),
    path('api/payroll/', PayrollListCreate.as_view(), name='payroll-list-create'),
    path('api/payroll/<int:pk>/', PayrollDetail.as_view(), name='payroll-detail'),
    path('api/payroll/<str:name>/', UpdatePayrollView.as_view(), name='update-payroll'),
    path('api/payroll-list/', PayrollListView.as_view(), name='payroll-list'),
    path("api/logs/", LogView.as_view(), name="logs"),
    path('api/cottages/', CottageListView.as_view(), name='cottage-list'),
    path('api/lodges/', LodgeListView.as_view(), name='lodge-list'),
    path('api/add-unit/', AddUnitView.as_view(), name='add-unit'),
    path("api/cottages/<int:pk>/delete/", DeleteCottageView.as_view(), name="delete_cottage"),
    path("api/lodges/<int:pk>/delete/", DeleteLodgeView.as_view(), name="delete_lodge"),
    path('api/cottage/<int:pk>/', UpdateCottageView.as_view(), name='updatecottage'),
    path('api/lodge/<int:pk>/', UpdateLodgeView.as_view(), name='update-lodge'),
    path('api/total-units/', TotalUnitsView.as_view(), name='total-units'),
    path('api/filter-units/', FilterUnitsView.as_view(), name='filter_units'),
    path('api/admin-accounts/', AdminAccountsView.as_view(), name='admin-accounts'),
    path("api/reservations/", ReservationView.as_view(), name="reservation"),
    path('api/reservations/<int:pk>/', ReservationView.as_view(), name="reservation-detail"),
    path("api-auth/", include("rest_framework.urls")),
    path('api/employees/', EmployeeCreateView.as_view(), name='api_employee'),
    path('api/attendance/', AttendanceView.as_view(), name='attendance'),
    path('api/attendance/<int:pk>/', AttendanceView.as_view(), name='attendance-update'),
    path('api/create-account/', CreateAccountView.as_view(), name='create_account'),
    path('api/check-username/<str:username>/', CheckUsernameView.as_view(), name='check-username'),
    path('api/create-admin/', CreateAdminView.as_view(), name='create-admin'),
    path('api/customer/register/', CustomerAccountRegisterView.as_view(), name='customer-register'),
    path("api/customer/login/", CustomerLoginView.as_view(), name="customer-login"),
    path('api/customer/details/', CustomerDetailsView.as_view(), name='customer-details'),
    path('api/customer/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path("api/calendar/", CalendarView.as_view(), name="calendar"),
    path('api/user-reservations/', UserReservationLogsView.as_view(), name='user-reservations'),
    path('api/customer-accounts/', CustomerAccountListView.as_view(), name='customer-accounts'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
