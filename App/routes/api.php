<?php

namespace App;

use App\Agent\AgentController;
use App\Booking\BookingController;
use App\BusinessProcess\BusinessProcessController;
use App\BusinessProcess\PaymentController;
use App\Mailing\MailingController;
use App\User\UserExternalController;
use Klein\Klein;

$Klein = new Klein();

// Authentication Routes
$Klein->respond('POST', '/api/v1/registration', [new UserController(), 'signUp']);
$Klein->respond('POST', '/api/v1/auth', [new UserController(), 'signIn']);
$Klein->respond('POST', '/api/v1/forgot', [new UserController(), 'forgotPassword']);
$Klein->respond('POST', '/api/v1/reset', [new UserController(), 'resetPassword']);

// User Routes
$Klein->respond('POST', '/api/v1/user', [new UserController(), 'createUser']);
$Klein->respond('PUT', '/api/v1/user/[:id]/edit', [new UserController(), 'updateUser']);
$Klein->respond('GET', '/api/v1/user/[:id]', [new UserController(), 'getUserById']);
$Klein->respond('GET', '/api/v1/user', [new UserController(), 'fetchUsers']);
$Klein->respond('DELETE', '/api/v1/user/[:id]', [new UserController(), 'deleteUser']);
$Klein->respond('PUT', '/api/v1/user/[:id]/tariff', [new UserController(), 'changeUserTariff']);

// User External Routes
$Klein->respond('POST', '/api/v1/user-external', [new UserExternalController(), 'createItem']);
$Klein->respond('PUT', '/api/v1/user-external/[:id]', [new UserExternalController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/user-external/[:id]', [new UserExternalController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/user-external', [new UserExternalController(), 'fetchList']);
$Klein->respond('DELETE', '/api/v1/user-external/[:id]', [new UserExternalController(), 'deleteItem']);

// Checker Routes
$Klein->respond('POST', '/api/v1/building/checker', [new CheckerController(), 'createChecker']);
$Klein->respond('PUT', '/api/v1/building/checker/[:id]', [new CheckerController(), 'updateChecker']);
$Klein->respond('GET', '/api/v1/building/checker/[:id]', [new CheckerController(), 'getCheckerById']);
$Klein->respond('GET', '/api/v1/building/[:id]/checker', [new CheckerController(), 'fetchCheckers']);
$Klein->respond('DELETE', '/api/v1/building/checker/[:id]', [new CheckerController(), 'deleteChecker']);

// Building Routes
$Klein->respond('POST', '/api/v1/building', [new BuildingController(), 'createBuilding']);
$Klein->respond('PUT', '/api/v1/building/[:id]', [new BuildingController(), 'updateBuilding']);
$Klein->respond('GET', '/api/v1/building/[:id]/info', [new BuildingController(), 'getBuildingById']);
$Klein->respond('GET', '/api/v1/building/[:id]/prices', [new BuildingController(), 'fetchBuildingPricesById']);
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

// Compilation Routes
$Klein->respond('GET', '/api/v1/compilation/[:compilationId]/[:buildingId]/[:compilationOldId]', [new CompilationController(), 'addBuildingInCompilation']);
$Klein->respond('GET', '/api/v1/compilation/[:compilationId]/[:buildingId]', [new CompilationController(), 'addBuildingInCompilation']);
$Klein->respond('DELETE', '/api/v1/compilation/[:compilationId]/[:buildingId]', [new CompilationController(), 'removeBuildingFromCompilation']);
$Klein->respond('POST', '/api/v1/compilation', [new CompilationController(), 'createItem']);
$Klein->respond('PUT', '/api/v1/compilation/[:id]', [new CompilationController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/compilation/[:id]', [new CompilationController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/compilation', [new CompilationController(), 'fetchList']);
$Klein->respond('DELETE', '/api/v1/compilation/[:id]', [new CompilationController(), 'deleteItem']);

// Administration Routes
$Klein->respond('GET', '/api/v1/administration/setting', [new AdministrationController(), 'fetchSettings']);
$Klein->respond('POST', '/api/v1/administration/setting', [new AdministrationController(), 'saveSettings']);

// Partner Routes
$Klein->respond('POST', '/api/v1/partner', [new PartnerController(), 'createItem']);
$Klein->respond('PUT', '/api/v1/partner/[:id]', [new PartnerController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/partner/[:id]', [new PartnerController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/partner', [new PartnerController(), 'fetchList']);
$Klein->respond('DELETE', '/api/v1/partner/[:id]', [new PartnerController(), 'deleteItem']);

// Question Routes
$Klein->respond('POST', '/api/v1/question', [new QuestionController(), 'createItem']);
$Klein->respond('PUT', '/api/v1/question/[:id]', [new QuestionController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/question/[:id]', [new QuestionController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/question', [new QuestionController(), 'fetchList']);
$Klein->respond('DELETE', '/api/v1/question/[:id]', [new QuestionController(), 'deleteItem']);

// Widget Routes
$Klein->respond('POST', '/api/v1/widget/ordering', [new WidgetController(), 'updateWidgetOrdering']);
$Klein->respond('POST', '/api/v1/widget', [new WidgetController(), 'createItem']);
$Klein->respond('PUT', '/api/v1/widget/[:id]', [new WidgetController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/widget/content', [new WidgetController(), 'fetchWidgetsContent']);
$Klein->respond('GET', '/api/v1/widget/[:id]/info', [new WidgetController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/widget', [new WidgetController(), 'fetchList']);
$Klein->respond('DELETE', '/api/v1/widget/[:id]', [new WidgetController(), 'deleteItem']);

// Post Routes
$Klein->respond('POST', '/api/v1/post', [new PostController(), 'createItem']);
$Klein->respond('PUT', '/api/v1/post/[:id]', [new PostController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/post/[:id]', [new PostController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/post', [new PostController(), 'fetchList']);
$Klein->respond('DELETE', '/api/v1/post/[:id]', [new PostController(), 'deleteItem']);

// Util Routes
$Klein->respond('GET', '/api/v1/views/[:objectType]/[:objectId]', [new UtilController(), 'updateCountViews']);
$Klein->respond('GET', '/api/v1/log', [new UtilController(), 'fetchLogs']);
$Klein->respond('GET', '/api/v1/search', [new UtilController(), 'fetchSearchGlobal']);
$Klein->respond('POST', '/api/v1/drop', [new Controller(), 'dropAllOlderFiles']);

// Messenger Routes
$Klein->respond('GET', '/api/v1/messenger/[:id]', [new MessengerController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/messenger', [new MessengerController(), 'fetchList']);

// BusinessProcess Routes
$Klein->respond('POST', '/api/v1/business-process/ordering', [new BusinessProcessController(), 'updateBusinessProcessesOrdering']);
$Klein->respond('POST', '/api/v1/business-process', [new BusinessProcessController(), 'createItem']);
$Klein->respond('PUT', '/api/v1/business-process/[:id]', [new BusinessProcessController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/business-process/[:id]', [new BusinessProcessController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/business-process', [new BusinessProcessController(), 'fetchList']);
$Klein->respond('DELETE', '/api/v1/business-process/[:id]', [new BusinessProcessController(), 'deleteItem']);

// Booking Routes
$Klein->respond('POST', '/api/v1/booking', [new BookingController(), 'createItem']);
$Klein->respond('PUT', '/api/v1/booking/[:id]', [new BookingController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/booking/[:id]', [new BookingController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/booking', [new BookingController(), 'fetchList']);

// Payment Routes
$Klein->respond('POST', '/api/v1/payment', [new PaymentController(), 'createItem']);
$Klein->respond('PUT', '/api/v1/payment/[:id]', [new PaymentController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/payment/[:id]/info', [new PaymentController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/payment/[:id]/link', [new PaymentController(), 'fetchLinkById']);
$Klein->respond('GET', '/api/v1/payment', [new PaymentController(), 'fetchList']);
$Klein->respond('POST', '/api/v1/paymentResult', [new PaymentController(), 'processResultResponse']);

// Mailing Routes
$Klein->respond('POST', '/api/v1/mailing', [new MailingController(), 'createItem']);
$Klein->respond('PUT', '/api/v1/mailing/[:id]', [new MailingController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/mailing/[:id]/info', [new MailingController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/mailing', [new MailingController(), 'fetchList']);
$Klein->respond('GET', '/api/v1/mailing/send', [new MailingController(), 'sendMailing']);
$Klein->respond('DELETE', '/api/v1/mailing/[:id]', [new MailingController(), 'deleteItem']);
$Klein->respond('DELETE', '/api/v1/mailing/[:mailingId]/[:userType]/[:userId]', [new MailingController(), 'deleteRecipient']);

// Agent Routes
$Klein->respond('POST', '/api/v1/agent', [new AgentController(), 'createItem']);
$Klein->respond('PUT', '/api/v1/agent/[:id]', [new AgentController(), 'updateItem']);
$Klein->respond('GET', '/api/v1/agent/[:id]', [new AgentController(), 'fetchItemById']);
$Klein->respond('GET', '/api/v1/agent', [new AgentController(), 'fetchList']);
$Klein->respond('DELETE', '/api/v1/agent/[:id]', [new AgentController(), 'deleteItem']);

// Dispatch all routes
$Klein->dispatch();