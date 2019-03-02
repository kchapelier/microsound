var url = {
    updateHash: function (duration, code) {
        var codeString = encodeURIComponent(jsBase64.Base64.encode(code));

        document.location.hash = '#duration=' + duration + '&code=' + codeString;
    },
    parseHash: function () {
        var data = {
            code: null,
            duration: null
        };

        var hash = document.location.hash,
            regex = /[#&]([a-z]+)=([^&]+)/g,
            option;

        while ((option = regex.exec(hash)) !== null) {
            switch (option[1]) {
                case 'duration':
                    data.duration = Math.max(1, Math.min(100, parseInt(option[2], 10)));
                    break;
                case 'code':
                    var code = decodeURIComponent(option[2]);
                    try {
                        code = jsBase64.Base64.decode(code);
                    } catch(e) {
                        code = null;
                    }
                    data.code = code;
                    break;
            }
        }

        return data;
    }
};


