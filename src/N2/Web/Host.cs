﻿using System;
using System.Collections.Generic;
using System.Text;
using N2.Configuration;

namespace N2.Web
{
	public class Host : N2.Web.IHost
	{
		private readonly IWebContext context;
		private Site defaultSite;
		private IList<Site> sites = new List<Site>();

		public Host(IWebContext context, HostSection host)
		{
			defaultSite = new Site(host.RootID, host.StartPageID);
			foreach (SiteElement site in host.Sites)
			{
				Sites.Add(new Site(host.RootID, site.ID, site.Name));
			}
		}

		public Host(IWebContext context, int rootItemID, int startPageID)
			: this(context, new Site(rootItemID, startPageID))
		{
		}

		public Host(IWebContext context, Site defaultSite)
		{
			this.context = context;
			this.defaultSite = defaultSite;
			sites.Add(defaultSite);
		}

		public Site DefaultSite
		{
			get { return defaultSite; }
			set { defaultSite = value; }
		}

		public Site CurrentSite
		{
			get { return defaultSite; }
		}

		public IList<Site> Sites
		{
			get { return sites; }
		}
	}
}
