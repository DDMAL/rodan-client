import Marionette from 'backbone.marionette';

/**
 * RunJob view.
 */
export default class ViewRunJob extends Marionette.ItemView {}
ViewRunJob.prototype.modelEvents = {
    'all': 'render'
};
ViewRunJob.prototype.template = '#template-main_runjob_individual';