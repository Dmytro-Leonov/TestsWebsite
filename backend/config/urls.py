from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from rest_framework.documentation import include_docs_urls


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(("tests_website.api.urls", "api"))),
    path("docs/", include_docs_urls(title="Test Website")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from config.settings.debug_toolbar.setup import DebugToolbarSetup  # noqa

urlpatterns = DebugToolbarSetup.do_urls(urlpatterns)
