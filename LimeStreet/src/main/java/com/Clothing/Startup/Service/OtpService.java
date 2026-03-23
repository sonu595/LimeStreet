package com.Clothing.Startup.Service;

import java.time.Duration;
import java.util.Locale;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private static final Duration OTP_TTL = Duration.ofMinutes(5);

    private final StringRedisTemplate redisTemplate;

    public OtpService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void storeOtp(String email, String otp) {
        redisTemplate.opsForValue().set(getOtpKey(email), otp, OTP_TTL);
    }

    public Optional<String> getOtp(String email) {
        return Optional.ofNullable(redisTemplate.opsForValue().get(getOtpKey(email)));
    }

    public void clearOtp(String email) {
        redisTemplate.delete(getOtpKey(email));
    }

    public boolean hasOtp(String email) {
        Boolean exists = redisTemplate.hasKey(getOtpKey(email));
        return Boolean.TRUE.equals(exists);
    }

    public long getTimeLeftSeconds(String email) {
        Long ttl = redisTemplate.getExpire(getOtpKey(email), TimeUnit.SECONDS);

        if (ttl == null || ttl < 0) {
            return 0;
        }

        return ttl;
    }

    private String getOtpKey(String email) {
        return "auth:otp:" + email.trim().toLowerCase(Locale.ROOT);
    }
}
