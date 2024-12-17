from rest_framework.permissions import BasePermission

class IsAdminOrEmployee(BasePermission):
    """
    Allows access only to users with 'Admin' or 'Employee' user_type.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type in ['Admin', 'Employee']


class IsAdminOnly(BasePermission):
    """
    Allows access only to users with 'Admin' user_type.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'Admin'


class AllUser(BasePermission):
    """
    Allows access to all authenticated users: Admin, Employee, and Customer.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type in ['Admin', 'Employee', 'Customer']
