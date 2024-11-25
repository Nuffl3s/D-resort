# views.py
from .models import Log
from .serializers import LogSerializer


class LogView(APIView):
    def get(self, request):
        logs = Log.objects.all().order_by("-timestamp")
        serializer = LogSerializer(logs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LogSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            action = serializer.validated_data["action"]
            timestamp = serializer.validated_data["timestamp"].replace(microsecond=0)

            # Use .get_or_create for logging
            log, created = Log.objects.get_or_create(
                username=username, action=action, timestamp=timestamp
            )
            if created:
                return Response(serializer.data, status=201)
            else:
                return Response({"message": "Log entry already exists"}, status=409)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        Log.objects.all().delete()
        Log.objects.create(username=request.user.username, action="Deleted all logs")
        return Response(status=204)


# models.py
class Log(models.Model):
    username = models.CharField(max_length=255)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)


# urls.py
from .views import LogView

path("logs/", LogView.as_view(), name="logs"),

# serializers.py
class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ["id", "username", "action", "timestamp"]