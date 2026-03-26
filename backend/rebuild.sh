#!/bin/bash

echo "================================"
echo "  开始重建 user-service 服务"
echo "================================"
cd user-service
mvn clean package -DskipTests
docker build -t backend-user-service:latest .
cd ..

echo -e "\n================================"
echo "  开始重建 gateway-service 服务"
echo "================================"
cd gateway-service
mvn clean package -DskipTests
docker build -t gateway-service:latest .
cd ..

echo -e "\n================================"
echo "  强制重启所有业务容器"
echo "================================"
docker compose --profile business up -d --force-recreate

echo -e "\n✅ 重建完成！"
echo "查看 user 日志: docker compose logs --tail=50 user-service"
echo "查看 gateway 日志: docker compose logs --tail=50 gateway-service"