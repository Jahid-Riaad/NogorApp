using NogorApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NogorApp.Utilities
{
    public class ModelResponse<T>
    {
        public string message { get; set; }

        public int totalRecord { get; set; }

        public List<T> data { get; set; }
    }
}
