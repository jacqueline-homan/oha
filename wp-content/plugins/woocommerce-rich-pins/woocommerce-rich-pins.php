<?php
/**
 * WooCommerce Product Rich Pins
 *
 * @package   WCRP
 * @author    Phil Derksen <pderksen@gmail.com>, Nick Young <mycorpweb@gmail.com>
 * @license   GPL-2.0+
 * @link      http://pinplugins.com
 * @copyright 2013-2014 Phil Derksen
 *
 * @wordpress-plugin
 * Plugin Name: WooCommerce Product Rich Pins
 * Plugin URI: http://pinplugins.com/woocommerce-rich-pins/
 * Description: Add Product Rich Pin meta tags to your WooCommerce product pages for enhanced pins on Pinterest.
 * Version: 1.0.2
 * Author: Phil Derksen
 * Author URI: http://philderksen.com
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Require the main class file
require_once( plugin_dir_path( __FILE__ ) . 'class-woocommerce-rich-pins.php' );

// Need to declare main plugin file constant here.
define ( 'WCRP_MAIN_FILE', __FILE__ );

/*
 * Register hooks that are fired when the plugin is activated or deactivated.
 * When the plugin is deleted, the uninstall.php file is loaded.
 */
register_activation_hook( __FILE__, array( 'WooCommerce_Rich_Pins', 'activate' ) );

add_action( 'plugins_loaded', array( 'WooCommerce_Rich_Pins', 'get_instance' ) );
