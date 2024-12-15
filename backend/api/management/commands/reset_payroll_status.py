from django.core.management.base import BaseCommand
from api.models import Payroll
from django.utils.timezone import now

class Command(BaseCommand):
    help = 'Reset payroll status based on the payroll type and timing.'

    def handle(self, *args, **kwargs):
        payrolls = Payroll.objects.all()
        for payroll in payrolls:
            if payroll.should_reset():
                payroll.reset_status()
                self.stdout.write(self.style.SUCCESS(f"Payroll for {payroll.employee.name} reset to 'Not yet'."))
        self.stdout.write(self.style.SUCCESS('Payroll status reset completed.'))
