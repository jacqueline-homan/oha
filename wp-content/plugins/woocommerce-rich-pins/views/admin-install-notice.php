<?php

/**
 * Show notice after plugin install/activate in admin dashboard until user acknowledges.
 *
 * @package    WCRP
 * @subpackage Views
 * @author     Phil Derksen <pderksen@gmail.com>, Nick Young <mycorpweb@gmail.com>
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>

<style>
	#wcrp-install-notice .button-primary,
	#wcrp-install-notice .button-secondary {
		margin-left: 15px;
	}
</style>

<div id="wcrp-install-notice" class="updated">
	<p>
		<?php echo $this->get_plugin_title() . __( ' is now installed.', 'wcrp' ); ?>
		<a href="<?php echo add_query_arg( 'page', $this->plugin_slug, admin_url( 'admin.php' ) ); ?>" class="button-primary"><?php _e( 'Setup Product Rich Pins now', 'wcrp' ); ?></a>
		<a href="<?php echo add_query_arg( 'wcrp-dismiss-install-nag', 1 ); ?>" class="button-secondary"><?php _e( 'Hide this', 'wcrp' ); ?></a>
	</p>
</div>
