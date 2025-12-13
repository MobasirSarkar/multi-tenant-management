from django.http import JsonResponse
from django.http.response import time


def health_check(request):
    res = {
        "status": "ok",
        "time": time.time(),
    }
    return JsonResponse(res)
