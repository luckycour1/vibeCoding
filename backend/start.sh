#!/bin/bash

echo "======================================"
echo "  正在启动 业务服务 (user + gateway) "
echo "======================================"

# 只启动业务服务，不影响mysql/nacos/redis
docker compose --profile business up -d

echo -e "✅ 业务服务已启动完成！"
echo -e "查看user日志: docker compose logs --tail=50 user-service"
echo -e "查看gateway日志: docker compose logs --tail=50 gateway-service"