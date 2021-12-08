from django.db import models

from users.models import Profile


class Announcement(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=140, verbose_name="Título")
    content = models.TextField(verbose_name="Contenido", blank=True)
    created_by = models.ForeignKey(Profile, on_delete=models.CASCADE)
    file_url = models.URLField(verbose_name="URL del archivo")
