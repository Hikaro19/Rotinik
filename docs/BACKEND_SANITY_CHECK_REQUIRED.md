# Backend Sanity Check Obrigatorio

O backend C# nao esta neste workspace. Estes ajustes precisam ser aplicados no repositorio ASP.NET Core antes de validar isolamento de dados fim a fim.

## Program.cs

Adicionar antes da configuracao de autenticacao JWT:

```csharp
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
```

Imports necessarios:

```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
```

Configurar JSON em camelCase:

```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
```

## RoutineService.cs

Todo metodo que lista rotinas do usuario deve filtrar por `userId`.

```csharp
return await _context.Routines
    .Where(r => r.UserId == userId)
    .ToListAsync();
```

Templates globais devem ser tratados em metodo separado, por exemplo:

```csharp
return await _context.Routines
    .Where(r => r.UserId == null && r.IsTemplate)
    .ToListAsync();
```

## Controllers

Se aparecer 401/403, revisar a extracao do usuario autenticado. Depois de limpar o claim map, `sub` deve ser lido de forma consistente:

```csharp
var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
    ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
```

Nenhum endpoint autenticado deve aceitar `userId` vindo do body ou query como fonte de autorizacao. O `userId` deve vir do token.
