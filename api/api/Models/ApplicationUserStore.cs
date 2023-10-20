using api.DataAccess;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.Xml;

namespace api.Models
{
    public class ApplicationUserStore : IUserStore<ApplicationUser>,
        IUserPasswordStore<ApplicationUser>,
        IUserEmailStore<ApplicationUser>,
        IUserRoleStore<ApplicationUser>
    {
        private readonly ApplicationDbContext _context;

        public ApplicationUserStore(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IdentityResult> CreateAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            // Implementace vytváření uživatele v Cosmos DB
            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> UpdateAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            // Implementace aktualizace uživatele v Cosmos DB
            _context.Users.Update(user);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            // Implementace smazání uživatele z Cosmos DB
            _context.Users.Remove(user);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<ApplicationUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FindAsync(userId, cancellationToken);
            return user;
        }

        public async Task<ApplicationUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            // Implementace hledání uživatele podle jména v Cosmos DB
            return await _context.Users
                .Where(u => u.NormalizedUserName == normalizedUserName)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public Task<string> GetUserIdAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Id);
        }

        public Task<string?> GetUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task SetUserNameAsync(ApplicationUser user, string? userName, CancellationToken cancellationToken)
        {
            user.UserName = userName;
            return Task.CompletedTask;
        }

        public Task<string?> GetNormalizedUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedUserName);
        }

        public Task SetNormalizedUserNameAsync(ApplicationUser user, string? normalizedName, CancellationToken cancellationToken)
        {
            user.NormalizedUserName = normalizedName;
            return Task.CompletedTask;
        }

        public Task<string> GetPasswordHashAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(!string.IsNullOrEmpty(user.PasswordHash));
        }

        public Task SetPasswordHashAsync(ApplicationUser user, string passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            //throw new NotImplementedException();
        }

        public Task SetEmailAsync(ApplicationUser user, string? email, CancellationToken cancellationToken)
        {
            user.Email = email;
            return Task.CompletedTask;
        }

        public Task<string?> GetEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.EmailConfirmed);
        }

        public Task SetEmailConfirmedAsync(ApplicationUser user, bool confirmed, CancellationToken cancellationToken)
        {
            user.EmailConfirmed = confirmed;
            return Task.CompletedTask;
        }

        public async Task<ApplicationUser?> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            return await _context.Users
                .Where(u => u.NormalizedEmail == normalizedEmail)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public Task<string?> GetNormalizedEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedEmail);
        }

        public Task SetNormalizedEmailAsync(ApplicationUser user, string? normalizedEmail, CancellationToken cancellationToken)
        {
            user.NormalizedEmail = normalizedEmail;
            return Task.CompletedTask;
        }

        public async Task AddToRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
        {
            var role = await _context.Roles
            .Where(r => r.NormalizedName == roleName)
            .FirstOrDefaultAsync(cancellationToken);

            if (role != null)
            {
                user.RoleId = role.Id;
                await _context.SaveChangesAsync(cancellationToken);
            } else
            {
                throw new Exception($"Roli se nepodařilo přidat.");
            }
        }

        public async Task RemoveFromRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
        {
            var role = await _context.Roles
            .Where(r => r.NormalizedName == roleName)
            .FirstOrDefaultAsync(cancellationToken);

            if (role != null && user?.RoleId == role.Id)
            {

                if (role != null)
                {
                    user.RoleId = null;
                    await _context.SaveChangesAsync(cancellationToken);
                    return;
                }
            }

            throw new Exception("Roli se nepodařilo odebrat");
        }

        public async Task<IList<string>> GetRolesAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            if(user.RoleId == null) return await Task.FromResult<IList<string>>(new List<string>());

            var role = await _context.Roles
            .Where(r => r.Id == user.RoleId)
            .FirstOrDefaultAsync(cancellationToken);

            if(role == null) return await Task.FromResult<IList<string>>(new List<string>());

            return await Task.FromResult<IList<string>>(new List<string> { role.Name });
        }

        public async Task<bool> IsInRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
        {
            var role = await _context.Roles
            .Where(r => r.NormalizedName == roleName)
            .FirstOrDefaultAsync(cancellationToken);

            if (role == null || user.RoleId == null) return false;

            return user.RoleId == role.Id;
        }

        public async Task<IList<ApplicationUser>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
        {
            var role = await _context.Roles
            .Where(r => r.NormalizedName == roleName)
            .FirstOrDefaultAsync(cancellationToken);

            if(role == null) return new List<ApplicationUser>();

            var usersInRole = _context.Users
            .Where(u => u.RoleId == role.Id)
            .ToList();

            return new List<ApplicationUser>(usersInRole);
        }
    }
}
