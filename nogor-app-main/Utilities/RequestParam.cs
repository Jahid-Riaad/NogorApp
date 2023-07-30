using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NogorApp.Utilities
{
    public class RequestParam
    {
        public int PageNo { get; set; }

        public int PageLength { get; set; }

        public string Search { get; set; }

        public int Batch { get; set; }

        public int Pay { get; set; }

        public int Todo { get; set; }
    }
}
