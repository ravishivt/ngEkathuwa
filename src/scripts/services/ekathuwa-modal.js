/**
 * ekathuwa
 * @version v0.1.3 - 2013-10-29
 * @link https://github.com/sarath2/ngEkathuwa
 * @author Sarath Ambegoda <sarath2mail@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (window, document, undefined) {
  'use strict';
  angular.module('ngEkathuwa', [])

  .run([
    '$rootScope',
    '$ekathuwa',
    function ($rootScope, $ekathuwa) {
      $rootScope.$ekathuwa = $ekathuwa;
    }
  ])

  .provider('$ekathuwa', function () {
    this.$get = [
      '$compile',
      '$rootScope',
      '$timeout',
      '$q',
      function ($compile, $rootScope, $timeout, $q) {
        this.modal = function (op) {
          var d = {
              id: 'ekathuwaModalID',
              scope: $rootScope.$new(),
              controller: null,
              backdrop: true,
              keyboard: true,
              remote: false,
              show: true,
              modalClass: 'fade',
              role: 'dialog',
              contentStyle: null,
              contentCustomSize: 0,
              contentPreSize: 'df',
              templateURL: null,
              templateHTML: null,
              bodyTemplateURL: null,
              bodyTemplate: null,
              header: true,
              headerText: null,
              headerClass: '',
              headerTemplate: null,
              headerCloseBtn: true,
              footer: true,
              footerClass: '',
              footerTemplate: null,
              footerCloseBtn: true,
              footerSaveBtn: false
            };
          var t = '', s = '', c = '', b = '', f = '', h = '';
          op = angular.extend(d, op);
          var btOPs = {
              backdrop: op.backdrop,
              keyboard: op.keyboard,
              remote: op.remote,
              show: op.show
            };
          var modSelector = '#' + op.id + ' .modal';
          c = op.controller ? 'ng-controller=' + op.controller : '';
          if (op.templateURL !== null && op.templateURL !== '') {
            t = '<div ' + c + ' id="' + op.id + '" ng-include="\'' + op.templateURL + '\'"></div>';
          } else {
            var a = '<div ' + c + ' id="' + op.id + '">';
            if (op.templateHTML !== null && op.templateHTML !== '') {
              t = a + op.templateHTML + '</div>';
            } else {
              if (op.bodyTemplateURL !== null && op.bodyTemplateURL !== '') {
                b = '<div class="modal-body" ng-include="\'' + op.bodyTemplateURL + '\'"></div>';
              } else {
                if (op.bodyTemplate !== null && op.bodyTemplate !== '') {
                  b = '<div class="modal-body">' + op.bodyTemplate + '</div>';
                } else {
                  b = '<div class="modal-body">Ekathuwa modal body.</div>';
                }
              }
              if (op.header) {
                if (op.headerTemplate !== null && op.headerTemplate !== '') {
                  h = '<div class="modal-header ' + op.headerClass + '">' + op.headerTemplate + '</div>';
                } else {
                  var ht = '';
                  if (op.headerText !== null && op.headerText !== '') {
                    ht = '<h4 id="myModalLabel" class="modal-title">' + op.headerText + '</h4>';
                  }
                  h = '<div class="modal-header ' + op.headerClass + '"><button ng-if="' + op.headerCloseBtn + '" aria-hidden="true" data-dismiss="modal" class="close" type="button">x</button>' + ht + '</div>';
                }
              }
              if (op.footer) {
                if (op.footerTemplate !== null && op.footerTemplate !== '') {
                  f = '<div class="modal-footer ' + op.footerClass + '">' + op.footerTemplate + '</div>';
                } else {
                  f = '<div class="modal-footer ' + op.footerClass + '"><button ng-if="' + op.footerCloseBtn + '" data-dismiss="modal" class="btn btn-default" type="button">Close</button><button ng-if="' + op.footerSaveBtn + '" class="btn btn-primary" type="button">Save changes</button></div>';
                }
              }
              t = a + '<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" class="modal fade" id="myModal" style="display: none;"><div class="modal-dialog"><div class="modal-content">' + h + b + f + '</div></div></div></div>';
            }
          }
          if (op.contentStyle !== null && op.contentStyle !== '') {
            s = op.contentStyle;
          }
          if (op.contentCustomSize !== 0 && angular.isNumber(op.contentCustomSize) && op.contentCustomSize !== '' && op.contentCustomSize !== null) {
            s = s + ';width: ' + op.contentCustomSize + '%;';
          }
          switch (op.contentPreSize) {
          case 'sm':
            s = s + ';width:25%;';
            break;
          case 'md':
            s = s + ';width:50%;';
            break;
          case 'lg':
            s = s + ';width:75%;';
            break;
          case 'fl':
            s = s + ';width:100%;';
            break;
          default:
            break;
          }
          s = s + 'transition: width 300ms;'
          function addStyle(body_height, id) {
            angular.element('#ekathuwaSt' + id).remove();
            var mq = '#' + id + ' .modal-body { height: ' + body_height + '; overflow: auto; margin-right: 1px; }';
            mq = mq + ' #' + id + ' .modal-dialog { ' + s + '} @media (max-width: 768px) {' + '#' + id + ' .modal-dialog {width:90%;} #' + id + ' .modal-body { height: auto; overflow: visible; }}';
            angular.element('head').append('<style id="ekathuwaSt' + id + '">' + mq + '</style>');
          }
          function calculateBodyHeight(window_height, id) {
            var header_height = angular.element('#' + id + ' .modal-header').outerHeight() || 60;
            var body_height = angular.element('#' + id + ' .modal-body').outerHeight() || 200;
            var footer_height = angular.element('#' + id + ' .modal-footer').outerHeight() || 60;
            var padding_top_bottom = 40 + 40;
            var max_height = (window_height - (header_height + footer_height + padding_top_bottom));
            if (body_height < max_height) {
              return "auto";
            }
            return max_height + "px";
          }
          angular.element('#' + op.id).remove();
          var m = angular.element(t);
          angular.element('body').append(m);
          $compile(m)(op.scope);
          var deferred = $q.defer();
          if (op.templateURL !== null && op.templateURL !== '') {
            $timeout(function () {
              deferred.resolve(angular.element(modSelector).modal(btOPs));
            }, 200);
          } else {
            deferred.resolve(angular.element(modSelector).modal(btOPs));
          }
          // Add styles immediately after modal is "shown".
          angular.element(modSelector).on('shown.bs.modal', function (e) {
            if (e.target != this) {
              return;
            }
            addStyle(calculateBodyHeight($(window).height(), op.id), op.id);
          });
          // Add style every time the window is resized.
          window.onresize = function(){
            angular.forEach(angular.element('.e-modal').parent(), function(value, key){
              addStyle(calculateBodyHeight($(window).height(), value.id), value.id);
            });
          };
          return deferred.promise;
        };
        return this;
      }
    ];
  });
}(window, document));