﻿using System.Web;
using System.Web.Optimization;

namespace NewPhotoCloud
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryplugins").Include(
              "~/Scripts/jquery-plugins/jquery-filetree.js",
              "~/Scripts/jquery-plugins/jquery-prettyPhoto.js",
              "~/Scripts/jquery-plugins/jquery.uploadify.js",
              "~/Scripts/jquery-plugins/jquery-cycle.all.js",
              "~/Scripts/jquery-plugins/jquery.cookie.js"));

            bundles.Add(new ScriptBundle("~/bundles/javascript").Include(
                       "~/Scripts/default.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/ResetStyleSheet.css",
                      "~/Content/bootstrap.css",
                      "~/Content/font-awesome.css",
                      "~/Content/filetree.css",
                      "~/Content/PrettyPhoto.css",
                      "~/Content/awesome-bootstrap-checkbox.css",
                      "~/Content/site.css"));
        }
    }
}
