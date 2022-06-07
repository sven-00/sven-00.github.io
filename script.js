user = "guest";
files = {
    "hello.txt": `
                    Hello,
        lorem ipsum dolor sit amet,
        consectetur adipiscing elit.
        Donec euismod, nisl eget consectetur
        egestas, nisl nunc euismod nisi,
        euismod egestas nisl nunc euismod nisi.
    `,
    "about.txt": "About me",
    ".secret.txt": "Root password: 12345678",
};

term = $('body').terminal({
    welcome: function() {
        this.echo("Welcome to my site!", ['keepWords']);
    },

    help: function () {
        this.echo("\nAvailable commands: \nhelp - Shows this menu \nhello - Shows the content of hello.txt \nabout - Shows the contents of about.txt \nls - Lists all files and directories \ncat - Shows the file content \nclear - Clears the terminal \nneofetch - Shows my system information \n", ["keepWords"]);
        if(user == "root"){
            this.echo("Root commands: \naustralia - Moves the site to australia \n");
        }
    },

    australia: function() {
        if(user == "root"){
            document.body.classList.add('australia');
            setTimeout(function () {
                document.body.classList.remove('australia');
            }, 5000);
        } else {
            this.error("Insufficient permissions");
        }
    },

    about: function () {
        this.exec("cat about.txt");
    },

    hello: function () {
        this.exec("cat hello.txt");
    },

    ls: function (arg) {
        if (arg == '-a') {
            this.echo(Object.keys(files));
        } else {
            this.echo(Object.keys(files).filter(function (file) {
                return file.indexOf('.') !== 0;
            }));
        }
    },

    cat: function (file) {
        if (file in files) {
            this.echo(files[file], ['keepWords']);
        } else {
            this.error('File not found');
        }
    },

    sudo: function (arg) {
        if (arg == "su") {
            if(user == "root"){
                this.error("You are already root");
            } else {
                this.set_mask(false).read('Password: ').then(password => {
                    if (password == '12345678') {
                        this.echo('Welcome back, root.');
                        user = 'root';
                        this.set_prompt('root@server:# ');
                    } else {
                        this.error('Wrong password.');
                    }
                });
                this.set_mask('*');
            }
        } else {
            this.error('Usage: sudo su');
        }
    },

    neofetch: function () {
        this.echo('OS: Fedora Linux,');
        this.echo('Kernel: 5.17.11-300.fc36.x86_64,');
        this.echo('Desktop Environment: GNOME,');
        this.echo('Shell: fish,');
        this.echo('CPU: Intel Core i5-9300HF,');
        this.echo('GPU: Nvidia Geforce GTX 1650,');
        this.echo('RAM: 16GB');
    },

    clear: function () {
        this.clear();
    },

    whoami: function () {
        this.echo(user);
    },
}, {
    checkArity: false,
    greetings: '/home/broekman \nType "help" for available commands \n\nNote: This site is still in development so not everything is working yet.',
    prompt: user + '@server:$ ',
});