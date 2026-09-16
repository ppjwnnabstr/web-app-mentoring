from django.db.models.signals import post_save
from django.dispatch import receiver

from mentorship.models import MentorshipRequest
from tasks.models import Task, TaskUpdate
from .models import Notification


@receiver(post_save, sender=MentorshipRequest)
def notify_on_request_change(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            recipient=instance.mentor.user,
            kind=Notification.Kind.REQUEST_RECEIVED,
            message=f"{instance.mentee.user.get_full_name()} sent you a mentorship request.",
            related_app_label="mentorship",
            related_object_id=instance.id,
        )
        return

    if instance.status == MentorshipRequest.Status.ACCEPTED:
        Notification.objects.create(
            recipient=instance.mentee.user,
            kind=Notification.Kind.REQUEST_ACCEPTED,
            message=f"{instance.mentor.user.get_full_name()} accepted your request.",
            related_app_label="mentorship",
            related_object_id=instance.id,
        )
    elif instance.status == MentorshipRequest.Status.REJECTED:
        Notification.objects.create(
            recipient=instance.mentee.user,
            kind=Notification.Kind.REQUEST_REJECTED,
            message=f"{instance.mentor.user.get_full_name()} declined your request.",
            related_app_label="mentorship",
            related_object_id=instance.id,
        )


@receiver(post_save, sender=Task)
def notify_on_task_created(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            recipient=instance.assigned_to.user,
            kind=Notification.Kind.TASK_ASSIGNED,
            message=f'New task assigned: "{instance.task_name}"',
            related_app_label="tasks",
            related_object_id=instance.id,
        )


@receiver(post_save, sender=TaskUpdate)
def notify_on_task_update(sender, instance, created, **kwargs):
    if not created or instance.author_id is None:
        return

    task = instance.task
    mentor_user = task.mentorship.mentor.user
    mentee_user = task.mentorship.mentee.user
    recipient = mentee_user if instance.author_id == mentor_user.id else mentor_user

    Notification.objects.create(
        recipient=recipient,
        kind=Notification.Kind.TASK_UPDATED,
        message=f'{instance.author.get_full_name()} commented on "{task.task_name}"',
        related_app_label="tasks",
        related_object_id=task.id,
    )
