<?php

namespace App;

use Klein\Klein;

$Klein = new Klein();

// UserPage Routes, Authentication Routes
$Klein->respond('POST', '/api/v1/registration', [new UserController(), 'signUp']);
$Klein->respond('POST', '/api/v1/auth', [new UserController(), 'signIn']);

// User Routes
$Klein->respond('POST', '/api/v1/user', [new UserController(), 'createUser']);
$Klein->respond('POST', '/api/v1/user/[:id]', [new UserController(), 'updateUser']);
$Klein->respond('GET', '/api/v1/user/[:id]', [new UserController(), 'getUserById']);
$Klein->respond('GET', '/api/v1/user', [new UserController(), 'fetchUsers']);
$Klein->respond('DELETE', '/api/v1/user/[:id]', [new UserController(), 'deleteUser']);

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