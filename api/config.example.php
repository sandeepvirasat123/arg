<?php
/**
 * Copy this file to api/config.php on the server and fill it in.
 * api/config.php is ignored by git and blocked from the web by .htaccess.
 */
return [
    // Where enquiries are saved. The default is outside public_html; change it only if needed.
    // 'data_dir' => '/home/USERNAME/arg_private/cp_enquiries',

    'notify_email' => 'info@assetrealtygroup.in',
    'from_email'   => 'no-reply@assetrealtygroup.in', // must be a mailbox/domain the host can send from

    // CRM: new leads are POSTed here as JSON (lead_type "Website CP Enquiry"). Leave blank until the CRM is ready.
    'crm_webhook'  => '',
    'crm_token'    => '',

    // Long random text used to hash visitor IP addresses for rate limiting
    'hash_salt'    => 'replace-with-a-long-random-string',
];
