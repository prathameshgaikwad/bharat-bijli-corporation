package com.prathameshShubham.bharatBijliCorporation.constants;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

public class SecurityConstants {
    public static final String JWT_COOKIE_NAME = "jwt-token";
    public static final String REFRESH_TOKEN_COOKIE_NAME = "refresh-token";
    public static final int JWT_EXPIRATION_TIME = 60 * 60;
    public static final int REFRESH_TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 7;
}
