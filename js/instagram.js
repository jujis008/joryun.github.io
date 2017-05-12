/*
 * jquery-instagram
 * http://potomak.github.com/jquery-instagram
 *
 * Copyright (c) 2013 Giovanni Cappellotto
 * Licensed under the MIT license.
 */

(function($) {

  function composeRequest(options) {
    var url = 'https://api.instagram.com/v1';
    var data = {};

    if (options.accessToken == null && options.clientId == null) {
      throw 'You must provide an access token or a client id';
    }

    data = $.extend(data, {
      access_token: options.accessToken || '',
      client_id: options.clientId || '',
      count: options.count || ''
    });

    if (options.url != null) {
      url = options.url;
    }
    else if (options.hash != null) {
      url += '/tags/' + options.hash + '/media/recent';
    }
    else if (options.search != null) {
      url += '/media/search';
      data = $.extend(data, options.search);
    }
    else if (options.userId != null) {
      if (options.accessToken == null) {
        throw 'You must provide an access token';
      }
      url += '/users/' + options.userId + '/media/recent';
    }
    else if (options.location != null) {
      url += '/locations/' + options.location.id + '/media/recent';
      delete options.location.id;
      data = $.extend(data, options.location);
    }
    else {
      url += '/media/popular';
    }
    
    return {url: url, data: data};
  }

  $.fn.instagram = function(options) {
    var that = this;
    options = $.extend({}, $.fn.instagram.defaults, options);
    var request = composeRequest(options);

    $.ajax({
      dataType: "jsonp",
      url: request.url,
      data: request.data,
      success: function(response) {
        that.trigger('didLoadInstagram', response);
      }
    });

    this.trigger('willLoadInstagram', options);
    
    return this;
  };

  $.fn.instagram.defaults = {
    accessToken: '3632186935.3ade026.8ad36a8b688c43a38bdc0e4fe8580c94',
    clientId: '3ade0267f8cc474fa53686aa6f7a8db5',
    count: null,
    url: null,
    hash: null,
    userId: null,
    location: null,
    search: null
  };

}(jQuery));
