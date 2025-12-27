.PHONY: help build build-dev up up-dev down logs clean

help: ## Mostrar esta ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Construir imagen de producción
	docker-compose build api

build-dev: ## Construir imagen de desarrollo
	docker-compose --profile dev build api-dev

up: ## Iniciar API en modo producción
	docker-compose up -d api

up-dev: ## Iniciar API en modo desarrollo (con hot reload)
	docker-compose --profile dev up api-dev

down: ## Detener y eliminar contenedores
	docker-compose down

logs: ## Ver logs del API
	docker-compose logs -f api

logs-dev: ## Ver logs del API en desarrollo
	docker-compose --profile dev logs -f api-dev

restart: ## Reiniciar contenedor
	docker-compose restart api

shell: ## Abrir shell en el contenedor
	docker-compose exec api sh

clean: ## Limpiar imágenes y contenedores
	docker-compose down -v
	docker system prune -f

ps: ## Ver estado de contenedores
	docker-compose ps

health: ## Verificar salud del API
	curl http://localhost:3000/health
