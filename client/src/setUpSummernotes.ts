import $ from "jquery";

// Expose jQuery globally for Summernote + Bootstrap
(window as any).$ = $;
(window as any).jQuery = $;

// Bootstrap (UMD) so tooltip() is added to jQuery
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Summernote
import "summernote/dist/summernote-bs4.css";
import "summernote/dist/summernote-bs4.js";

export default $;
