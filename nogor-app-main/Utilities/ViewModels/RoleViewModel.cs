using System;
using System.Collections.Generic;

namespace NogorApp.Utilities.ViewModels
{
    public class RoleViewModel
    {
        public RoleViewModel()
        {
            Users = new List<string>();
        }

        public string Id { get; set; }

        public string Name { get; set; } 

        public string Email { get; set; }

        public List<string> Users { get; }

    }
}
