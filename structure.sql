CREATE TABLE `sdi_user_token` (
    `id` int(11) NOT NULL,
    `user_id` bigint(20) NOT NULL,
    `jwt_token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `sdi_user_token`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_user_token`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_user` (
    `id` int(11) NOT NULL,
    `first_name` varchar(255) NOT NULL,
    `last_name` varchar(255) DEFAULT NULL,
    `email` varchar(255) DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `password` varchar(255) NOT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `last_active` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `block` int(1) NOT NULL DEFAULT 1,
    `role` varchar(100) NOT NULL DEFAULT 'subscriber',
    `id_avatar` int(11) DEFAULT NULL,
    `settings` text,
    `forgot` varchar(255) DEFAULT NULL,
    `post` int(11) DEFAULT NULL,
    `tariff` varchar(20) NOT NULL DEFAULT 'free',
    `tariff_expired` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `sdi_user`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_user`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_building` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `address` varchar(255) DEFAULT NULL,
    `author` int(11) DEFAULT NULL,
    `type` varchar(50) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `publish` int(1) NOT NULL DEFAULT 0,
    `rent` int(1) NOT NULL DEFAULT 0,
    `status` varchar(100) NOT NULL DEFAULT 'sold',
    `area_min` float(5, 2) DEFAULT NULL,
    `area_max` float(5, 2) DEFAULT NULL,
    `cost_min` float(11, 2) DEFAULT NULL,
    `cost_max` float(11, 2) DEFAULT NULL,
    `cost_min_unit` float(11, 2) DEFAULT NULL,
    `meta_title` varchar(255) DEFAULT NULL,
    `meta_description` varchar(255) DEFAULT NULL
);

ALTER TABLE `sdi_building`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_building`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_building_data` (
    `id` int(11) NOT NULL,
    `district` varchar(100) DEFAULT NULL,
    `district_zone` varchar(100) DEFAULT NULL,
    `house_class` varchar(255) DEFAULT NULL,
    `material` varchar(255) DEFAULT NULL,
    `house_type` varchar(255) DEFAULT NULL,
    `entrance_house` varchar(255) DEFAULT NULL,
    `parking` varchar(255) DEFAULT NULL,
    `territory` varchar(255) DEFAULT NULL,
    `ceiling_height` float(5, 2) DEFAULT NULL,
    `maintenance_cost` float(5, 2) DEFAULT NULL,
    `distance_sea` int(11) DEFAULT NULL,
    `gas` varchar(255) DEFAULT NULL,
    `heating` varchar(255) DEFAULT NULL,
    `electricity` varchar(255) DEFAULT NULL,
    `sewerage` varchar(255) DEFAULT NULL,
    `water_supply` varchar(255) DEFAULT NULL,
    `advantages` text DEFAULT NULL,
    `payments` varchar(255) DEFAULT NULL,
    `formalization` VARCHAR(255) DEFAULT NULL,
    `amount_contract` VARCHAR(10) DEFAULT 'full',
    `surcharge_doc` float(11, 2) DEFAULT NULL,
    `surcharge_gas` float(11, 2) DEFAULT NULL,
    `sale_no_resident` int(1) DEFAULT 0,
    `passed` varchar(100) DEFAULT NULL,
    `id_avatar` int(11) DEFAULT NULL,
    `avatar` varchar(255) DEFAULT NULL,
    `cadastr_number` varchar(255) DEFAULT NULL,
    `cadastr_cost` float(11, 2) DEFAULT NULL
);

ALTER TABLE `sdi_building_data`
    ADD PRIMARY KEY (`id`);



CREATE TABLE `sdi_tag` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1
);

ALTER TABLE `sdi_tag`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_tag`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_building_tag` (
    `id_building` int(11) NOT NULL,
    `id_tag` int(11) NOT NULL
);

ALTER TABLE `sdi_building_tag`
    ADD PRIMARY KEY (`id_building`, `id_tag`);



CREATE TABLE `sdi_building_checker` (
    `id` int(11) NOT NULL,
    `id_building` int(11) NOT NULL,
    `author` int(11) DEFAULT NULL,
    `name` varchar(255) NOT NULL,
    `area` float(5, 2) DEFAULT NULL,
    `cost` float(11, 2) DEFAULT NULL,
    `furnish` varchar(255) DEFAULT 'draft',
    `housing` int(3) DEFAULT 1,
    `stage` varchar(10) DEFAULT 'Ц',
    `rooms` int(3) DEFAULT 1,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `status` varchar(100) NOT NULL DEFAULT 'free'
);

ALTER TABLE `sdi_building_checker`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_building_checker`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_images` (
    `id` int(11) NOT NULL,
    `id_object` int(11) NOT NULL,
    `type_object` varchar(10) DEFAULT 'building',
    `name` varchar(255) NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `avatar` int(1) NOT NULL DEFAULT 1
);

ALTER TABLE `sdi_images`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_images`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_feedback` (
    `id` int(11) NOT NULL,
    `author` int(11) DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    `title` varchar(255) NOT NULL,
    `type` varchar(10) DEFAULT 'feed',
    `id_object` int(11) DEFAULT NULL,
    `type_object` varchar(10) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `status` varchar(100) NOT NULL DEFAULT 'new'
);

ALTER TABLE `sdi_feedback`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_feedback`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_feedback_message` (
    `id` int(11) NOT NULL,
    `id_feed` int(11) DEFAULT NULL,
    `author` int(11) DEFAULT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `status` varchar(100) NOT NULL DEFAULT 'new',
    `content` text NOT NULL,
    `date_created` datetime NOT NULL
);

ALTER TABLE `sdi_feedback_message`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_feedback_message`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_log` (
    `id` int(11) NOT NULL,
    `id_user` int(11) DEFAULT NULL,
    `content` text NOT NULL,
    `type` varchar(10) NOT NULL,
    `id_object` int(11) DEFAULT NULL,
    `type_object` varchar(10) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1
);

ALTER TABLE `sdi_log`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_log`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_developer` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `address` varchar(255) DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `author` int(11) DEFAULT NULL,
    `type` varchar(50) DEFAULT 'constructionCompany',
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `id_avatar` int(11) DEFAULT NULL
);

ALTER TABLE `sdi_developer`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_developer`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_building_contact` (
    `id_building` int(11) NOT NULL,
    `id_user` int(11) NOT NULL,
    `type_contact` varchar(10) DEFAULT 'user'
);

ALTER TABLE `sdi_building_contact`
    ADD PRIMARY KEY (`id_building`, `id_user`, `type_contact`);



CREATE TABLE `sdi_building_developer` (
    `id_building` int(11) NOT NULL,
    `id_developer` int(11) NOT NULL
);

ALTER TABLE `sdi_building_developer`
    ADD PRIMARY KEY (`id_building`, `id_developer`);



CREATE TABLE `sdi_document` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `id_attachment` int(11) NOT NULL,
    `id_object` int(11) DEFAULT NULL,
    `type_object` varchar(10) DEFAULT NULL,
    `type` varchar(10) DEFAULT 'file',
    `active` int(1) NOT NULL DEFAULT 1,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `author` int(11) DEFAULT NULL,
    `content` text DEFAULT NULL
);

ALTER TABLE `sdi_document`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_document`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_article` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `author` int(11) DEFAULT NULL,
    `type` varchar(50) DEFAULT 'article',
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `publish` int(1) NOT NULL DEFAULT 0,
    `meta_title` varchar(255) DEFAULT NULL,
    `meta_description` varchar(255) DEFAULT NULL,
    `id_avatar` int(11) DEFAULT NULL,
    `avatar` varchar(255) DEFAULT NULL
);

ALTER TABLE `sdi_article`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_article`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_building_article` (
    `id_building` int(11) NOT NULL,
    `id_article` int(11) NOT NULL
);

ALTER TABLE `sdi_building_article`
    ADD PRIMARY KEY (`id_building`, `id_article`);



CREATE TABLE `sdi_views` (
    `id_object` int(11) DEFAULT NULL,
    `type_object` varchar(10) DEFAULT 'building',
    `views` int(11) DEFAULT 0
);

ALTER TABLE `sdi_views`
    ADD PRIMARY KEY (`id_object`, `type_object`);



CREATE TABLE `sdi_attachment` (
    `id` int(11) NOT NULL,
    `author` int(11) DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    `description` varchar(255) DEFAULT NULL,
    `content` text DEFAULT NULL,
    `type` varchar(10) DEFAULT 'image',
    `extension` varchar(10) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `poster` int(11) NOT NULL
);

ALTER TABLE `sdi_attachment`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_attachment`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_images` (
    `id_attachment` int(11) NOT NULL,
    `id_object` int(11) NOT NULL,
    `type_object` varchar(10) DEFAULT 'building',
    `ordering` int(11) DEFAULT 0
);

ALTER TABLE `sdi_images`
    ADD PRIMARY KEY (`id_attachment`, `id_object`, `type_object`);



CREATE TABLE `sdi_videos` (
    `id_attachment` int(11) NOT NULL,
    `id_object` int(11) NOT NULL,
    `type_object` varchar(10) DEFAULT 'building',
    `ordering` int(11) DEFAULT 0
);

ALTER TABLE `sdi_videos`
    ADD PRIMARY KEY (`id_attachment`, `id_object`, `type_object`);



CREATE TABLE `sdi_favorite` (
    `id_user` int(11) NOT NULL,
    `id_building` int(11) NOT NULL
);

ALTER TABLE `sdi_favorite`
    ADD PRIMARY KEY (`id_user`, `id_building`);



CREATE TABLE `sdi_notification` (
    `id` int(11) NOT NULL,
    `author` int(11) DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    `description` text DEFAULT NULL,
    `type` varchar(10) DEFAULT 'system',
    `id_object` int(11) DEFAULT NULL,
    `type_object` varchar(10) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1
);

ALTER TABLE `sdi_notification`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_notification`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_user_notification` (
    `id_user` int(11) NOT NULL,
    `id_notification` int(11) NOT NULL,
    `status` varchar(10) DEFAULT 'new'
);

ALTER TABLE `sdi_user_notification`
    ADD PRIMARY KEY (`id_user`, `id_notification`);



CREATE TABLE `sdi_compilation` (
    `id` int(11) NOT NULL,
    `author` int(11) DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    `description` varchar(255) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1
);

ALTER TABLE `sdi_compilation`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_compilation`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_compilation_building` (
    `id_compilation` int(11) NOT NULL,
    `id_building` int(11) NOT NULL
);

ALTER TABLE `sdi_compilation_building`
    ADD PRIMARY KEY (`id_compilation`, `id_building`);



CREATE TABLE `sdi_setting` (
    `name` varchar(255) DEFAULT NULL,
    `value` varchar(255) DEFAULT NULL
);

ALTER TABLE `sdi_setting`
    ADD PRIMARY KEY (`name`);



CREATE TABLE `sdi_widget` (
    `id` int(11) NOT NULL,
    `name` varchar(255) DEFAULT NULL,
    `type` varchar(10) DEFAULT 'article',
    `style` varchar(10) DEFAULT 'list',
    `page` varchar(45) DEFAULT 'main',
    `ordering` int(11) DEFAULT 0,
    `active` int(1) NOT NULL DEFAULT 1
);

ALTER TABLE `sdi_widget`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_widget`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_widget_item` (
    `id_widget` int(11) NOT NULL,
    `id_object` int(11) NOT NULL,
    `type_object` varchar(10) NOT NULL,
    `ordering` int(11) DEFAULT 0
);

ALTER TABLE `sdi_widget_item`
    ADD PRIMARY KEY (`id_widget`, `id_object`, `type_object`);



CREATE TABLE `sdi_partner` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `subtitle` varchar(255) DEFAULT NULL,
    `author` int(11) DEFAULT NULL,
    `type` varchar(50) DEFAULT 'partner',
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `meta_title` varchar(255) DEFAULT NULL,
    `meta_description` varchar(255) DEFAULT NULL,
    `id_avatar` int(11) DEFAULT NULL,
    `info` text DEFAULT NULL
);

ALTER TABLE `sdi_partner`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_partner`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_question` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `author` int(11) DEFAULT NULL,
    `type` varchar(50) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1
);

ALTER TABLE `sdi_question`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_question`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_post` (
    `id` int(11) NOT NULL,
    `post_id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `author` int(11) DEFAULT NULL,
    `type` varchar(50) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1
);

ALTER TABLE `sdi_post`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_post`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_messenger` (
    `id` int(11) NOT NULL,
    `date_created` datetime NOT NULL,
    `author` int(11) DEFAULT NULL,
    `id_avatar` int(11) DEFAULT NULL,
    `name` varchar(255) NOT NULL,
    `type` varchar(50) DEFAULT 'private'
);

ALTER TABLE `sdi_messenger`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_messenger`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_messenger_intervals` (
    `id` int(11) NOT NULL,
    `id_messenger` int(11) NOT NULL,
    `id_user` int(11) NOT NULL,
    `id_message_start` int(11) DEFAULT NULL,
    `id_message_last` int(11) DEFAULT NULL
);

ALTER TABLE `sdi_messenger_intervals`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_messenger_intervals`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_messenger_member` (
    `id_messenger` int(11) NOT NULL,
    `id_user` int(11) NOT NULL,
    `id_message_readed` int(11) DEFAULT NULL,
    `id_message_deleted` int(11) DEFAULT NULL,
    `active` int(1) NOT NULL DEFAULT 1
);

ALTER TABLE `sdi_messenger_member`
    ADD PRIMARY KEY (`id_messenger`, `id_user`);



CREATE TABLE `sdi_messenger_messages` (
    `id` int(11) NOT NULL,
    `id_messenger` int(11) NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `type` varchar(50) DEFAULT 'text',
    `text` text DEFAULT NULL,
    `author` int(11) DEFAULT NULL,
    `id_user` int(11) NOT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `id_message_parent` int(11) DEFAULT NULL
);

ALTER TABLE `sdi_messenger_messages`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_messenger_messages`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_business_process` (
    `id` int(11) NOT NULL,
    `id_ticket` int(11) DEFAULT NULL,
    `author` int(11) DEFAULT NULL,
    `responsible` int(11) DEFAULT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `type` varchar(50) DEFAULT NULL,
    `step` varchar(50) DEFAULT 'default',
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL
);

ALTER TABLE `sdi_business_process`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_business_process`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_business_process_relation` (
    `id_business_process` int(11) NOT NULL,
    `id_object` int(11) NOT NULL,
    `type_object` varchar(10) NOT NULL
);

ALTER TABLE `sdi_business_process_relation`
    ADD PRIMARY KEY (`id_business_process`, `id_object`, `type_object`);



CREATE TABLE `sdi_business_process_attendee` (
    `id_business_process` int(11) NOT NULL,
    `id_user` int(11) NOT NULL
);

ALTER TABLE `sdi_business_process_attendee`
    ADD PRIMARY KEY (`id_business_process`, `id_user`);



CREATE TABLE `sdi_business_process_sorting` (
    `id_user` int(11) NOT NULL,
    `sorting` text NOT NULL
);

ALTER TABLE `sdi_business_process_sorting`
    ADD PRIMARY KEY (`id_user`);



CREATE TABLE `sdi_building_price` (
    `id_object` int(11) DEFAULT NULL,
    `type_object` varchar(10) DEFAULT 'building',
    `date_update` datetime NOT NULL,
    `cost` float(11, 2) DEFAULT NULL
);

ALTER TABLE `sdi_building_price`
    ADD PRIMARY KEY (`id_object`, `type_object`, `date_update`);



CREATE TABLE `sdi_building_rent` (
    `id_building` int(11) DEFAULT NULL,
    `description` text DEFAULT NULL,
    `type` varchar(10) DEFAULT 'long',
    `deposit` int(1) NOT NULL DEFAULT 0,
    `commission` int(1) NOT NULL DEFAULT 0,
    `cost` float(11, 2) DEFAULT NULL,
    `cost_deposit` float(11, 2) DEFAULT NULL,
    `cost_comission` float(11, 2) DEFAULT NULL
);

ALTER TABLE `sdi_building_rent`
    ADD PRIMARY KEY (`id_building`);



CREATE TABLE `sdi_booking` (
    `id` int(11) NOT NULL,
    `date_start` datetime DEFAULT NULL,
    `date_finish` datetime DEFAULT NULL,
    `status` varchar(50) DEFAULT 'new',
    `id_building` int(11) DEFAULT NULL,
    `id_user` int(11) DEFAULT NULL
);

ALTER TABLE `sdi_booking`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_booking`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_transaction` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `date_paid` datetime DEFAULT NULL,
    `status` varchar(50) DEFAULT 'pending',
    `id_user` int(11) DEFAULT NULL,
    `email` varchar(255) DEFAULT NULL,
    `cost` float(11, 2) DEFAULT NULL,
    `id_object` int(11) NOT NULL,
    `type_object` varchar(10) NOT NULL
);

ALTER TABLE `sdi_transaction`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_transaction`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_user_external` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `sdi_user_external`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_user_external`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_mailing` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `content` text DEFAULT NULL,
    `content_html` text DEFAULT NULL,
    `type` varchar(20) DEFAULT 'mail',
    `author` int(11) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `status` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `sdi_mailing`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_mailing`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_mailing_recipients` (
    `id_mailing` int(11) DEFAULT NULL,
    `id_user` varchar(10) DEFAULT 'building',
    `type_user` varchar(10) DEFAULT 'subscriber'
);

ALTER TABLE `sdi_mailing_recipients`
    ADD PRIMARY KEY (`id_mailing`, `id_user`, `type_user`);



CREATE TABLE `sdi_agent` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `address` varchar(255) DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `author` int(11) DEFAULT NULL,
    `type` varchar(50) DEFAULT 'agent',
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `id_avatar` int(11) DEFAULT NULL
);

ALTER TABLE `sdi_agent`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_agent`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_building_agent` (
    `id_building` int(11) NOT NULL,
    `id_agent` int(11) NOT NULL
);

ALTER TABLE `sdi_building_agent`
    ADD PRIMARY KEY (`id_building`, `id_agent`);



CREATE TABLE `sdi_agent_contact` (
    `id` int(11) NOT NULL,
    `id_agent` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `post` varchar(255) NOT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `author` int(11) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1
);

ALTER TABLE `sdi_agent_contact`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_agent_contact`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_deal` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `date_finish` datetime DEFAULT NULL,
    `status` varchar(50) DEFAULT 'pending',
    `id_user` int(11) DEFAULT NULL,
    `id_object` int(11) NOT NULL,
    `type_object` varchar(10) NOT NULL,
    `cost` float(11, 2) DEFAULT NULL,
    `duration` varchar(50) DEFAULT NULL
);

ALTER TABLE `sdi_deal`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_deal`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_store_categories` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `author` int(11) DEFAULT NULL,
    `fields` text DEFAULT NULL,
    `meta_title` varchar(255) DEFAULT NULL,
    `meta_description` varchar(255) DEFAULT NULL
);

ALTER TABLE `sdi_store_categories`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_store_categories`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_store_product` (
    `id` int(11) NOT NULL,
    `id_category` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `cost` float(11, 2) DEFAULT NULL,
    `cost_old` float(11, 2) DEFAULT NULL,
    `id_avatar` int(11) DEFAULT NULL,
    `avatar` varchar(255) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1,
    `author` int(11) DEFAULT NULL,
    `fields` text DEFAULT NULL,
    `meta_title` varchar(255) DEFAULT NULL,
    `meta_description` varchar(255) DEFAULT NULL
);

ALTER TABLE `sdi_store_product`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sdi_store_product`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



CREATE TABLE `sdi_store_product_price` (
    `id` int(11) DEFAULT NULL,
    `date_update` datetime NOT NULL,
    `cost` float(11, 2) DEFAULT NULL
);

ALTER TABLE `sdi_store_product_price`
    ADD PRIMARY KEY (`id`, `date_update`);



CREATE TABLE `sdi_subscribers` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) DEFAULT NULL,
    `date_created` datetime NOT NULL,
    `date_update` datetime NOT NULL,
    `active` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;