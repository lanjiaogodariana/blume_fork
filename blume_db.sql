-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 01, 2026 at 10:08 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blume_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `base_users`
--

CREATE TABLE `base_users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `base_users`
--

INSERT INTO `base_users` (`id`, `full_name`, `email`, `password`, `created_at`) VALUES
(2, 'Calista Wong', 'calistawong413@gmail.com', '$2y$10$6seUHLysvoxYAMKb2yPes.g21Kb6gBj2OkOIoy2.TZ.QirW.kZK46', '2026-10-28 03:10:16'),
(4, 'chongyao', 'limchongyao0216@gmail.com', '$2y$10$u0uLrGlhLf8IEq0UoHIh7ux0.j87GYO2AqMaRz1Bq50z3Cihwicg2', '2026-10-28 03:13:11');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `shipping_address` text NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(20) DEFAULT NULL,
  `design_changes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_name`, `user_email`, `shipping_address`, `total_amount`, `order_date`, `phone`, `design_changes`) VALUES
(1, 'Chong Yao Lim', 'limchongyao0216@gmail.com', 'Blk 289c Punggol Place', '356.00', '2026-10-22 11:41:36', NULL, NULL),
(2, 'Calista Wong', 'calistawong413@gmail.com', 'Blk 289c Punggol Place', '89.00', '2026-10-22 12:09:01', NULL, NULL),
(3, 'Calista Wong', 'calistawong413@gmail.com', 'Blk 289c Punggol Place\r\n#05-859', '89.00', '2026-10-22 12:57:06', '96335398', NULL),
(4, 'Calista Wong', 'calistawong413@gmail.com', '333', '89.00', '2026-10-22 12:57:35', '33333', NULL),
(5, 'Calista Wong', 'calistawong413@gmail.com', '33', '89.00', '2026-10-22 13:06:38', '22233333', NULL),
(6, 'Calista Wong', 'calista@gmail.com', '$$%^&amp;&amp;', '45.00', '2026-10-22 13:07:54', '22222222', 'shorten'),
(7, 'Calista Wong', 'calistawong413@gmail.com', 'Blk 289c Punggol Place\r\n#05-859', '89.00', '2026-10-22 13:36:24', '32432413', '1313'),
(8, 'Calista Wong', 'calista@gmail.com', 'Blk 289c Punggol Place\r\n#05-859', '65.00', '2026-10-31 18:25:47', '96335398', ''),
(9, 'Calista Wong', 'calistawong413@gmail.com', 'Blk 289c Punggol Place\r\n#05-859', '89.00', '2026-10-31 18:28:16', '96335398', '');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 4, 4, '89.00'),
(2, 2, 1, 1, '89.00'),
(3, 3, 4, 1, '89.00'),
(4, 4, 1, 1, '89.00'),
(5, 5, 1, 1, '89.00'),
(6, 6, 2, 1, '45.00'),
(7, 7, 1, 1, '89.00'),
(8, 8, 3, 1, '65.00'),
(9, 9, 1, 1, '89.00');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `image_url_2` varchar(255) DEFAULT NULL,
  `image_url_3` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `colors` varchar(255) DEFAULT 'Standard',
  `sizes` varchar(255) DEFAULT 'XS, S, M, L, XL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `image_url`, `image_url_2`, `image_url_3`, `description`, `colors`, `sizes`) VALUES
(1, 'Yellow Maxi Dress', '89.00', 'assets/yellow_dress.jpg', 'assets/yellow_dress2.jpg', 'assets/white_dress.jpg', 'A soft casual staple perfect for summer.', 'Yellow, White, Navy', 'XS, S, M, L, XL'),
(2, 'Polka Dot Top & Skirt', '45.00', 'assets/polka.jpg', 'assets/polkatop2.jpg', 'assets/polkatop3.jpg', 'Lightweight and breathable.', 'White, Black', 'XS, S, M, L, XL'),
(3, 'Trench Coat', '65.00', 'assets/trench2.jpg', 'assets/trench.jpg', 'assets/trench3.jpg', 'Cozy layers in neutral tones.', 'Brown, Mocha', 'XS, S, M, L, XL'),
(4, 'Prilliane Lace V-Neck', '45.00', 'assets/clarin.webp', 'assets/clarin2.webp', 'assets/clarin3.webp', 'An ultra-soft lace top with a gentle v-neckline.', 'White, Ivory', 'XS, S, M, L'),
(5, 'Claire Top', '35.00', 'assets/clairetop.jpg', 'assets/clairetop_2.webp', NULL, 'A lightweight, soft summer top perfect for layering over skirts.', 'Pastel Blue, Cream, ', 'S, M, L'),
(6, 'Halter Neck Dress', '49.00', 'assets/halterneck.avif', 'assets/halterneck_2.avif', 'assets/halterneck_3.avif', 'Elegant mini dress.', 'Cream, Black', 'XS, S, M, L, XL'),
(7, 'Casette Dress', '48.00', 'assets/casette.webp\r\n', 'assets/casette2.webp\r\n', 'assets/casette3.webp\r\n', 'An elegant casette babydoll dress in a soft, breathable fabric.', 'Blue, Rose', 'S, M, L'),
(8, 'Elora Slip Dress', '65.00', 'assets/elora.webp', 'assets/elore2.webp', NULL, 'A floral slip dress with adjustable straps and a flattering bias cut.', 'Floral Dream', 'XS, S, M, L'),
(9, 'Sylvie Babydoll Top', '32.00', 'assets/sylvie babydoll.webp', 'assets/sylviebabydoll2.webp', NULL, 'A classic babydoll top that moves beautifully as you walk.', 'Cream', 'S, M, L'),
(10, 'Edeline Pleated Dress', '62.00', 'assets/edeline3.webp', 'assets/edeline2.webp', 'assets/edeline.webp', 'A classic pleated dress that is perfect for summer.', 'Blue, Yellow, Pink', 'S, M, L'),
(11, 'Willa Skirt', '22.00', 'assets/willa.jpg', 'assets/willa2.webp', NULL, 'A mini skirt that moves beautifully as you walk.', 'Cream', 'S, M, L'),
(12, 'Romantic Mesh Mini Dress', '55.00', 'assets/mesh.webp', 'assets/mesh_2.webp', 'assets/mesh_3.webp', 'A lightweight, soft bud mesh dress perfect for date.', 'Cream', 'S, M, L'),
(13, 'Cashmere Blend Ribbon Sweater', '85.00', 'assets/ribbon.webp', 'assets/ribbon2.webp', 'assets/ribbon3.webp', 'An ultra-soft cashmere blend sweater with a ribbon.', 'Soft Grey, Ivory', 'XS, S, M, L'),
(14, 'Lulune Top', '38.00', 'assets/lulune.webp\r\n', 'assets/lulune2.webp\r\n', 'assets/lulune3.webp\r\n', 'A top in a soft, breathable fabric.', 'White, Sage', 'S, M, L'),
(1000, 'Satin Slip Dress', '95.00', 'assets/satin.webp', 'assets/satin2.webp', 'assets/satin3.webp', 'A minimalist slip dress with adjustable straps and a flattering cut.', 'Champagne, Black, Navy', 'XS, S, M, L');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `base_users`
--
ALTER TABLE `base_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `google_id` (`google_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `base_users`
--
ALTER TABLE `base_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1001;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
