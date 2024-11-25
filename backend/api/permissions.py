from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type in ['Admin', 'Employee']


class IsAdminOnly(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'Admin'
