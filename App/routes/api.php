<?php

namespace App;

use Klein\Klein;

$Klein = new Klein();

// UserPage Routes, Authentication Routes
$Klein->respond('POST', '/api/v1/registration', [new UserController(), 'signUp']);
$Klein->respond('POST', '/api/v1/auth', [new UserController(), 'signIn']);

//$Klein->respond(['PATCH', 'PUT'], '/api/v1/catalog/[:id]', [new CatalogController(), 'updateCatalog']);
//$Klein->respond(['GET', 'HEAD'], '/api/v1/fetch-catalog-by-id/[:id]', [new CatalogController(), 'fetchCatalogById']);
//$Klein->respond(['GET', 'HEAD'], '/api/v1/fetch-catalog-by-name/[:name]', [new CatalogController(), 'fetchCatalogByName']);
//$Klein->respond(['GET', 'HEAD'], '/api/v1/catalogs', [new CatalogController(), 'fetchCatalogs']);

// Building Routes
$Klein->respond('POST', '/api/v1/building', [new BuildingController(), 'createBuilding']);
$Klein->respond('POST', '/api/v1/building/[:id]', [new BuildingController(), 'updateBuilding']);
$Klein->respond('GET', '/api/v1/building/[:id]', [new BuildingController(), 'getBuildingById']);
$Klein->respond('GET', '/api/v1/building', [new BuildingController(), 'fetchBuildings']);
$Klein->respond('DELETE', '/api/v1/building/[:id]', [new BuildingController(), 'deleteBuilding']);

// Tag Routes
$Klein->respond('POST', '/api/v1/tag', [new TagController(), 'createTag']);
$Klein->respond('POST', '/api/v1/tag/[:id]', [new TagController(), 'updateTag']);
$Klein->respond('GET', '/api/v1/tag/[:id]', [new TagController(), 'getTagById']);
$Klein->respond('GET', '/api/v1/tag', [new TagController(), 'fetchTags']);
$Klein->respond('DELETE', '/api/v1/tag/[:id]', [new TagController(), 'deleteTag']);

// Dispatch all routes
$Klein->dispatch();