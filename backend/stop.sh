#!/bin/bash

echo "======================================"
echo "  正在停止 业务服务 (user + gateway) "
echo "======================================"

# 只停止业务服务，不影响mysql/nacos/redis
docker compose --profile business stop

echo -e "✅ 业务服务已全部停止！"