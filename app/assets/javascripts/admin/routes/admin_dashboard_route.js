/**
  Handles the default admin route

  @class AdminDashboardRoute
  @extends Discourse.Route
  @namespace Discourse
  @module Discourse
**/
Discourse.AdminDashboardRoute = Discourse.Route.extend({
  setupController: function(c) {
    if( !c.get('versionCheckedAt') || Date.create('12 hours ago') > c.get('versionCheckedAt') ) {
      this.checkVersion(c);
    }
    if( !c.get('reportsCheckedAt') || Date.create('1 hour ago') > c.get('reportsCheckedAt') ) {
      this.fetchReports(c);
    }
  },

  renderTemplate: function() {
    this.render({into: 'admin/templates/admin'});
  },

  checkVersion: function(c) {
    if( Discourse.SiteSettings.version_checks ) {
      c.set('versionCheckedAt', new Date());
      Discourse.VersionCheck.find().then(function(vc) {
        c.set('versionCheck', vc);
        c.set('loading', false);
      });
    }
  },

  fetchReports: function(c) {
    // TODO: use one request to get all reports, or maybe one request for all dashboard data including version check.
    c.set('reportsCheckedAt', new Date());
    ['visits', 'signups', 'topics', 'posts'].each(function(reportType){
      c.set(reportType,  Discourse.Report.find(reportType));
    });
  }
});

