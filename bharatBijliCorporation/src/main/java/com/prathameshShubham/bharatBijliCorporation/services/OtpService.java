package com.prathameshShubham.bharatBijliCorporation.services;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final ScheduledExecutorService schedulerService = Executors.newScheduledThreadPool(1);

    public String generateOtp(String userId) {
        String otp = String.valueOf((int) ((Math.random() * 900000) + 100000));
        otpStore.put(userId, otp);
        // Schedule OTP removal after 5 minutes
        schedulerService.schedule(() -> invalidateOtp(userId),5, TimeUnit.MINUTES);
        return otp;
    }

    public boolean validateOtp(String userId, String otp) {
        return otp.equals(otpStore.get(userId));
    }

    public void invalidateOtp(String userId) {
        otpStore.remove(userId);
    }
}
