import random as rd

def generate_otp(length=6):
    """Generate a numeric OTP"""
    return ''.join([str(rd.randint(0, 9)) for _ in range(length)])