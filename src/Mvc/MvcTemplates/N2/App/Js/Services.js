﻿(function (module) {
	module.factory('Interface', function ($resource) {
		var res = $resource('Api/Interface.ashx', {}, {});
		return res;
	});

	module.factory('Content', function ($resource) {
		var res = $resource('Api/Content.ashx/:target', { target: '' }, {
			children: { method: 'GET', params: { target: 'children' } },
			move: { method: 'POST', params: { target: 'move' } },
			sort: { method: 'POST', params: { target: 'sort' } }
		});

		res.states = {
			None: 0,
			New: 1,
			Draft: 2,
			Waiting: 4,
			Published: 16,
			Unpublished: 32,
			Deleted: 64,
			All: 2 + 4 + 8 + 16 + 32 + 64,
			is: function (actual, expected) {
				return (actual & expected) == expected;
			}
		};
		
		return res;
	});

	module.factory('Translations', function ($resource) {
		var res = $resource('Api/Translations.ashx', {}, {});
		return res;
	});

	module.factory('Context', function ($resource) {
		var res = $resource('Api/Context.ashx', {}, {});

		return res;
	});

	module.factory('Versions', function ($resource) {
		var res = $resource('Api/Versions.ashx', {}, {});
		return res;
	});

	module.factory('Alert', function () {
		var callbacks = [];
		var alert = {
			subscribe: function (callback) {
				callbacks.push(callback);
			},
			unsubscribe: function (callback) {
				callbacks.slice(callbacks.indexOf(callback), 1);
			},
			show: function (options) {
				angular.forEach(callbacks, function (cb) { cb(options); });
			}
		};
		return alert;
	});

	module.factory('SortHelperFactory', function (Content, Alert) {
		window.Ct = Content;
		var context = {}
		return function (scope) {
			function reload(ctx) {
				var node = ctx.scopes.to && ctx.scopes.to.node;
				if (!node) return;

				node.HasChildren = true;
				node.Loading = true;
				Content.children({ selected: node.Current.Path }, function (data) {
					node.Children = data.Children;
					node.Expanded = true;
					node.Loading = false;
					if (data.IsPaged)
						node.IsPaged = true;
				});
			}
			this.move = function (ctx) {
				console.log("moving", ctx);
				Content.move(ctx.paths, function () {
					console.log("moved", ctx);

					reload(ctx);
					Alert.show({ message: "Successfully noved " + (ctx.scopes.selected && ctx.scopes.selected.node && ctx.scopes.selected.node.Current.Title), type: "success", timeout: 3000 });
				}, function () {
					Alert.show({ message: "Failed moving " + (ctx.scopes.selected && ctx.scopes.selected.node && ctx.scopes.selected.node.Current.Title), type: "error" });
				});
			};
			this.sort = function (ctx) {
				console.log("sorting", ctx);
				Content.sort(ctx.paths, function () {
					console.log("sorted", ctx);

					reload(ctx);
					Alert.show({ message: "Successfully sorted " + (ctx.scopes.selected && ctx.scopes.selected.node && ctx.scopes.selected.node.Current.Title), type: "success", timeout: 3000 });
				}, function () {
					Alert.show({ message: "Failed sorting " + (ctx.scopes.selected && ctx.scopes.selected.node && ctx.scopes.selected.node.Current.Title), type: "error" });
				});
			};

			return this;
		};
	});

})(angular.module('n2.services', ['ngResource']));