angular.module('das.services')
	.factory("BundleDataService", [ '$filter', 'BUNDLE_FOR', function($filter, BUNDLE_FOR) {
		return {
			generateDefaultBundleDescription: function(bundle) {
				var description = '';
				var bundleName = '';
				if(bundle.bundleFor != BUNDLE_FOR.length - 1) bundleName = BUNDLE_FOR[bundle.bundleFor] + ' ' + bundle.bundleName;
				else bundleName = bundle.bundleName;
				if(bundle.bundleType === 0) {
					description = 'We are raising money for ' + bundleName + '.';
					if(bundle.targetType == 1) description += ' We need to reach ' + $filter('currency')(bundle.target, '£', 0) + ' to make this happen.';
					
				}
				else if(bundle.bundleType === 1) {
					description = 'We are raising money for ' + bundleName + '.	We each need to pay ' + $filter('currency')(bundle.target, '£', 0) + '. we need a minimum of ' + bundle.minPeopleCount + ' and a maximum of ' + bundle.maxPeopleCount + ' of us to make this bundle.';
				}
				else if(bundle.bundleType === 2) {
					description = 'We are spitting ' + $filter('currency')(bundle.target, '£', 0) + ' for ' + bundleName + '. We need ' + bundle.minPeopleCount + ' of us to make this happen.';
				}
				description += '\nCome on guys!';

				return description;
			},

			getProgressDescription: function(bundle) {
				var sum = 0;
				if(bundle.bundleType === 0) {
					sum = bundle.target;
				}
				else if(bundle.bundleType == 1) {
					sum = bundle.target * bundle.minPeopleCount;
				}
				else if(bundle.bundleType == 2) {
					sum = bundle.target;
				}

				var raised = _.reduce(bundle.contributions, function(sum, cont) { return sum + cont.transaction.amount; }, 0);

				var days_left = bundle.duration - moment().diff(moment(bundle.createdAt), 'days');
				if(days_left > 1) days_left = days_left + ' days left';
				else if(days_left > 0) days_left = '1 day left';
				else days_left = 'This bundle has ended.';

				return '£' + raised + ' of £' + sum + ' raised so far\n' + days_left;
			}
		};
	}]);