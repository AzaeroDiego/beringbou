import type {MetadataRoute} from 'next';
import {site} from '@/data/site';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return (site.production?['/']:['/','/entradas/','/conceptos/']).map(p=>({url:site.url+p}))}
