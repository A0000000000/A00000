package com.a00000.interceptor;

import com.a00000.utils.TokenUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class PermissionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        try {
            String token = request.getParameter("TOKEN");
            if (TokenUtils.getTOKEN().equals(token)) {
                return true;
            } else {
                StringBuffer sb = new StringBuffer();
                sb.append(("{"));
                sb.append("\"status\": \"failed\", ");
                sb.append("\"message\": \"该请求无权访问该资源!\"");
                sb.append("}");
                response.getWriter().write(sb.toString());
                return false;
            }
        } catch (Exception e) {
        }
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}
