package com.a00000.interceptor;

import com.a00000.utils.TokenUtils;
import com.a00000.utils.URLUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 用于校验URL所携带的key和value是否合法的拦截器
 */
public class TokenInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String url = request.getRequestURI();
        if (URLUtils.isInterceptor(url)) {
            String key = request.getParameter("key");
            String value = request.getParameter("value");
            if (TokenUtils.getKey().equals(key) && TokenUtils.getValue().equals(value)){
                return true;
            } else {
                StringBuffer sb = new StringBuffer();
                sb.append("{");
                sb.append(String.format("\"%s\" : \"%s\",", "status", "failed"));
                sb.append(String.format("\"%s\" : \"%s\"", "message", "令牌错误!"));
                sb.append("}");
                response.getWriter().write(sb.toString());
                return false;
            }
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}
