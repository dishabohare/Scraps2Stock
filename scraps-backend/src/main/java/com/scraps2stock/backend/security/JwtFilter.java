package com.scraps2stock.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Public routes
        if (path.startsWith("/api/users/login") || path.startsWith("/api/users/signup")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (path.startsWith("/api/users/login") ||
                path.startsWith("/api/users/signup") ||
                path.startsWith("/api/users/reset-password")) {
            filterChain.doFilter(request, response);
            return;
        }
        // Optional public read routes for now
        if (path.startsWith("/api/inventory/all") ||
                path.startsWith("/api/orders/vendor") ||
                path.startsWith("/api/orders/supplier") ||
                path.startsWith("/api/inventory/supplier") ||
                path.startsWith("/api/disputes")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        System.out.println("AUTH HEADER = " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        try {
            String token = authHeader.substring(7);
            System.out.println("TOKEN = " + token);

            String email = JwtUtil.extractEmail(token);
            System.out.println("EMAIL FROM TOKEN = " + email);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    new java.util.ArrayList<>());

            SecurityContextHolder.getContext().setAuthentication(authentication);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            System.out.println("JWT ERROR = " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or expired token");
        }
    }
}