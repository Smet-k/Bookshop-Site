# Bookshop Site
Bookshop Site is a project that was made as an exam for IT Step academy. Powered by **.NET**, uses **MS SQL** as a database and utilizes **Stripe** as a payment system.

## How to use
> [!WARNING]
> Project will work without stripe and authentication  services, but database must be setup in order for website to work.

### Create database
To create database use Visual Studio.
First you should set your connection string in [appsettings.json](https://github.com/Smet-k/Bookshop-Site/blob/main/Web/appsettings.json)
```
  "ConnectionStrings": {
    "DefaultConnection": "DATA SOURCE={Your_server_name}; DATABASE={any_database_name};User Id=Username;password=Password;/*or Integrated Security=True;*/ TrustServerCertificate=True; MultipleActiveResultSets=true;"
  },
```
 then navigate to Package Manager Console and type `update-database`.

### Admin functions
Default admin user credentials 
`Email: admin@gmail.com`
`Password: 1qaz!QAZ`

### Setting up Stripe
To setup [Stripe](https://stripe.com/) you'll just need to change placeholder keys in [appsettings.json](https://github.com/Smet-k/Bookshop-Site/blob/main/Web/appsettings.json) to your personal ones.
```
  "Stripe": {
    "SecretKey": "{Your_stripe_secretKey}",
    "Publishable": "{Your_publish_key}"
  }
```


### Setting up authentication services
There is a Facebook authentication placeholder in [Program.cs](https://github.com/Smet-k/Bookshop-Site/blob/main/Web/Program.cs) already, but you'll still need to put your AppId and AppSecret. You can get one at [Facebook Developers](https://developers.facebook.com/).
```
builder.Services.AddAuthentication()
    .AddFacebook(options =>
    {
        options.AppId = "{Your_appId}";
        options.AppSecret = "{Your_appSecret}";
    });
```
