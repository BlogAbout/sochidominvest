<?php

namespace App;

use Klein\Klein;

$Klein = new Klein();

// Authentication Routes
$Klein->respond('POST', '/api/v1/registration', [new UserController(), 'signUp']);
$Klein->respond('POST', '/api/v1/auth', [new UserController(), 'signIn']);

// User Routes
$Klein->respond('POST', '/api/v1/user', [new UserController(), 'createUser']);
$Klein->respond('PUT', '/api/v1/user/[:id]', [new UserController(), 'updateUser']);
$Klein->respond('GET', '/api/v1/user/[:id]', [new UserController(), 'getUserById']);
$Klein->respond('GET', '/api/v1/user', [new UserController(), 'fetchUsers']);
$Klein->respond('DELETE', '/api/v1/user/[:id]', [new UserController(), 'deleteUser']);

// Checker Routes
$Klein->respond('POST', '/api/v1/building/checker', [new CheckerController(), 'createChecker']);
$Klein->respond('PUT', '/api/v1/building/checker/[:id]', [new CheckerController(), 'updateChecker']);
$Klein->respond('GET', '/api/v1/building/checker/[:id]', [new CheckerController(), 'getCheckerById']);
$Klein->respond('GET', '/api/v1/building/[:id]/checker', [new CheckerController(), 'fetchCheckers']);
$Klein->respond('DELETE', '/api/v1/building/checker/[:id]', [new CheckerController(), 'deleteChecker']);

// Building Routes
$Klein->respond('POST', '/api/v1/building', [new BuildingController(), 'createBuilding']);
$Klein->respond('PUT', '/api/v1/building/[:id]', [new BuildingController(), 'updateBuilding']);
$Klein->respond('GET', '/api/v1/building/[:id]', [new BuildingController(), 'getBuildingById']);
$Klein->respond('GET', '/api/v1/building', [new BuildingController(), 'fetchBuildings']);
$Klein->respond('DELETE', '/api/v1/building/[:id]', [new BuildingController(), 'deleteBuilding']);

// Tag Routes
$Klein->respond('POST', '/api/v1/tag', [new TagController(), 'createTag']);
$Klein->respond('PUT', '/api/v1/tag/[:id]', [new TagController(), 'updateTag']);
$Klein->respond('GET', '/api/v1/tag/[:id]', [new TagController(), 'getTagById']);
$Klein->respond('GET', '/api/v1/tag', [new TagController(), 'fetchTags']);
$Klein->respond('DELETE', '/api/v1/tag/[:id]', [new TagController(), 'deleteTag']);

// Developer Routes
$Klein->respond('POST', '/api/v1/developer', [new DeveloperController(), 'createDeveloper']);
$Klein->respond('PUT', '/api/v1/developer/[:id]', [new DeveloperController(), 'updateDeveloper']);
$Klein->respond('GET', '/api/v1/developer/[:id]', [new DeveloperController(), 'getDeveloperById']);
$Klein->respond('GET', '/api/v1/developer', [new DeveloperController(), 'fetchDevelopers']);
$Klein->respond('DELETE', '/api/v1/developer/[:id]', [new DeveloperController(), 'deleteDeveloper']);

// Feed Routes
$Klein->respond('POST', '/api/v1/feed', [new FeedbackController(), 'createFeed']);
$Klein->respond('PUT', '/api/v1/feed/[:id]', [new FeedbackController(), 'updateFeed']);
$Klein->respond('GET', '/api/v1/feed/[:id]', [new FeedbackController(), 'getFeedById']);
$Klein->respond('GET', '/api/v1/feed', [new FeedbackController(), 'fetchFeeds']);
$Klein->respond('DELETE', '/api/v1/feed/[:id]', [new FeedbackController(), 'deleteFeed']);

// DocumentPagePanel Routes
$Klein->respond('POST', '/api/v1/document', [new DocumentController(), 'createDocument']);
$Klein->respond('PUT', '/api/v1/document/[:id]', [new DocumentController(), 'updateDocument']);
$Klein->respond('GET', '/api/v1/document/[:id]', [new DocumentController(), 'getDocumentById']);
$Klein->respond('GET', '/api/v1/document', [new DocumentController(), 'fetchDocuments']);
$Klein->respond('DELETE', '/api/v1/document/[:id]', [new DocumentController(), 'deleteDocument']);

// Article Routes
$Klein->respond('POST', '/api/v1/article', [new ArticleController(), 'createItem']);
$Klein->respond('PUT', '/api/v1/article/[:id]', [new ArticleController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/article/[:id]', [new ArticleController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/article', [new ArticleController(), 'fetchList']);
$Klein->respond('DELETE', '/api/v1/article/[:id]', [new ArticleController(), 'deleteItem']);

// Attachment Routes
$Klein->respond('POST', '/api/v1/attachment', [new AttachmentController(), 'uploadAttachment']);
$Klein->respond('PUT', '/api/v1/attachment/[:id]', [new AttachmentController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/attachment/[:id]', [new AttachmentController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/attachment', [new AttachmentController(), 'fetchList']);
$Klein->respond('DELETE', '/api/v1/attachment/[:id]', [new AttachmentController(), 'deleteItem']);

// Favorite Routes
$Klein->respond('POST', '/api/v1/favorite', [new FavoriteController(), 'createItem']);
$Klein->respond('GET', '/api/v1/favorite', [new FavoriteController(), 'fetchList']);
$Klein->respond('DELETE', '/api/v1/favorite/[:buildingId]', [new FavoriteController(), 'deleteItem']);

// Notification Routes
$Klein->respond('GET', '/api/v1/notification/count', [new NotificationController(), 'fetchCountNewNotifications']);
$Klein->respond('GET', '/api/v1/notification/read', [new NotificationController(), 'readNotificationsAll']);
$Klein->respond('POST', '/api/v1/notification', [new NotificationController(), 'createItem']);
$Klein->respond('GET', '/api/v1/notification/[:notificationId]/info', [new NotificationController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/notification/[:notificationId]/read', [new NotificationController(), 'readNotification']);
$Klein->respond('GET', '/api/v1/notification', [new NotificationController(), 'fetchList']);
$Klein->respond('DELETE', '/api/v1/notification/[:notificationId]', [new NotificationController(), 'deleteItem']);

// Util Routes
$Klein->respond('GET', '/api/v1/views/[:objectType]/[:objectId]', [new UtilController(), 'updateCountViews']);
$Klein->respond('GET', '/api/v1/log', [new UtilController(), 'fetchLogs']);

// Dispatch all routes
$Klein->dispatch();