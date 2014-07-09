var App = angular.module('canvas', []).
    config(['$httpProvider','$interpolateProvider', function ($httpProvider,$interpolateProvider) {
        function csrfSafeMethod(method) {
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
        function sameOrigin(url) {
            var host = document.location.host; // host + port
            var protocol = document.location.protocol;
            var sr_origin = '//' + host;
            var origin = protocol + sr_origin;
            return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                !(/^(\/\/|http:|https:).*/.test(url));
        }
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                    xhr.setRequestHeader("X-CSRF-Token", $('meta[name=_csrf]').attr('content'));
                }
            }
        });
        $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=_csrf]').attr('content');
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
}]).run(['$rootScope', function ($rootScope) {}]);
App.controller("mainController", function () {
    $('.posits').perfectScrollbar();
    $('.edit_text').on('keyup', function (a) {
        var len = $(this).val().length;
        if (len >= 140) {
            $(this).val($(this).val().substring(0, len - 1));
        }
    });
});
App.controller("boardController", function ($scope,$http,$timeout) {
    $scope.board_prof = {
        initialize: function (array,config) {
            if(config){
                this.config=config;
                this.revconfig={}
                for(var item in config){
                    this.revconfig[config[item]]=item;
                }
                var self=this;
                this.posits=[];
                for(var item in array){
                    var obj={};
                    for(var j in config){
                        obj[j]=array[item][config[j]];
                    }
                    self.posits.push(obj)
                }
            }else{
                this.posits=array;
            }
        },
        project:{
            id:1
        },
        keys: {
            key_partnerships: {
                section_key: "ASOCIACIONES CLAVE"
            },
            key_activities: {
                section_key: "ACTIVIDADES CLAVE"
            },
            key_resources: {
                section_key: "RECURSOS CLAVE"
            },
            value_proposition: {
                section_key: "PROPUESTAS DE VALOR"
            },
            relations_customers: {
                section_key: "RELACION CON LOS CLIENTES"
            },
            channels: {
                section_key: "CANALES"
            },
            customer_segments: {
                section_key: "SEGMENTOS DE MERCADO"
            },
            cost_structure: {
                section_key: "ESTRUCTURA DE COSTOS"
            },
            sources_revenue: {
                section_key: "FUENTES DE INGRESO"
            }
        },
        posits: [],
        parse_data:function(data){
            var obj={};
            var self=this;
            for(var item in data){
                   obj[self.config[item]]=data[item];
            }
            return obj;
        },
        unparse_data:function(data){
            var obj={};
            var self=this;
            for(var item in data){
                   obj[self.revconfig[item]]=data[item];
            }
            return obj;
        },
        edit_posit: function (posit) {
            console.log(posit)
            posit.edit_active = true;
        },
        cancel_posit: function (posit) {
            posit.edit_active = false;
        },
        prep_del: function (posit) {
            posit.del_active = true;
        },
        cancel_del: function (posit) {
            posit.del_active = false;
        },
        create_posit: function (posit) {
            var self=this;
            if(posit){
                posit.section_key=this.append_active.section_key;
                posit=self.parse_data(posit);
                $http({method: 'post', url: '/api/project/'+self.project.id+"/canvas/posits/"}).
                    success(function(data, status, headers, config) {
                        data=self.unparse_data(posit);
                        self.posits.push(data);
                        $scope.nposit={};
                        posit={};
                        self.append_active=null;
                        $timeout(function(){
                            $('.posits').perfectScrollbar('update');
                        },500);
                    }).
                    error(function(data, status, headers, config) {
                    });
            }else{
                $scope.nposit={};
                $scope.nposit.err=true;
            }
        },
        update_posit:function(posit){
            var self=this;
            if(posit.description!=""&&posit.description){
                var data=self.parse_data(posit);
                $http({method: 'PUT',data:data, url: '/api/project/'+self.project.id+"/canvas/posits/"+posit.id}).
                    success(function(data, status, headers, config) {
                        posit.edit_active = false;
                        posit=self.parse_data(data);
                    }).
                    error(function(data, status, headers, config) {
                    });
            }else{
                posit.err=true;
            }
        },
        delete_posit:function(posit){
            var self=this;
            $http({method: 'DELETE', url: '/api/project/'+self.project.id+"/canvas/posits/"+posit.id}).
                success(function(data, status, headers, config) {
                    for(var item in self.posits){
                        if(posit.id==self.posits[item].id){
                            self.posits.splice(item,1);
                        }
                    }
                }).
                error(function(data, status, headers, config) {
                });
        },
        active_append:function(str){
            $scope.nposit=null;
            this.append_active=str;
        }
    };
    $scope.board_prof.initialize(new Array(),{
        section_key:"seccion",
        id:"id",
        description:"contenido",
        created_date:"creada",
        "edited_date":"editada"
    });
});

