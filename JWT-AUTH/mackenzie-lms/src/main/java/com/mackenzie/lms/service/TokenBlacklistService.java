package com.mackenzie.lms.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {

    private static final Logger logger = LoggerFactory.getLogger(TokenBlacklistService.class);
    private static final String BLACKLIST_PREFIX = "blacklist:token:";

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public void adicionarTokenNaBlacklist(String token, Date expiration) {
        try {
            String key = BLACKLIST_PREFIX + token;
            long ttl = expiration.getTime() - System.currentTimeMillis();

            if (ttl > 0) {
                redisTemplate.opsForValue().set(key, "revoked", ttl, TimeUnit.MILLISECONDS);
                logger.info("Token adicionado à blacklist com TTL: {} ms", ttl);
            } else {
                logger.warn("Token já expirado, não adicionado à blacklist");
            }
        } catch (Exception e) {
            logger.error("Erro ao adicionar token à blacklist: {}", e.getMessage());
        }
    }

    public boolean isTokenNaBlacklist(String token) {
        try {
            String key = BLACKLIST_PREFIX + token;
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            logger.error("Erro ao verificar token na blacklist: {}", e.getMessage());
            return false;
        }
    }

    public void limparTokensExpirados() {
        // Redis automaticamente remove chaves expiradas
        // Este método pode ser usado para limpeza manual se necessário
        logger.info("Limpeza de tokens expirados executada");
    }
}