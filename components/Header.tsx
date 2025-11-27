<nav className="hidden md:flex items-center gap-5 text-sm">
  <Link href="/" className={isActive("/") ? "font-medium" : "text-slate-300"}>
    Главная
  </Link>
  <Link
    href="/doctors"
    className={isActive("/doctors") ? "font-medium" : "text-slate-300"}
  >
    Врачи
  </Link>
  <Link
    href="/services"
    className={isActive("/services") ? "font-medium" : "text-slate-300"}
  >
    Услуги
  </Link>
  <Link
    href="/reviews"
    className={isActive("/reviews") ? "font-medium" : "text-slate-300"}
  >
    Отзывы
  </Link>
  <Link
    href="/docs"
    className={isActive("/docs") ? "font-medium" : "text-slate-300"}
  >
    Документы
  </Link>
</nav>
